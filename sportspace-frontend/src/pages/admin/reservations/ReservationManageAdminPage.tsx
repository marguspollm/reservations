import {
  cancelReservation,
  getAllReservations,
} from "../../../services/reservation.service";
import ReservationManage from "../../../components/reservation/ReservationManage";
import { Alert } from "@mui/material";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/Loading";
import { useAsyncFetch } from "../../../hooks/useAsyncFetch";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Notifiy from "../../../components/Notifiy";

function ReservationAdminPage() {
  const { t } = useTranslation();
  const reservations = useFetch(() => getAllReservations());

  const {
    execute: deleteExecute,
    loading: deleteLoading,
    error: deleteError,
  } = useAsyncFetch();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!id) return;

    setDeletingId(id);
    try {
      await deleteExecute(cancelReservation, id);
      setSuccessMessage(t("success.reservation.deleted"));
      reservations.setData(prev =>
        prev ? prev.filter(f => f.id !== id) : prev,
      );
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (reservations.loading) return <Loading open />;
  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  if (!reservations.data)
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {t("error.notfound.reservations")}
      </Alert>
    );

  return (
    <>
      {reservations.data.length !== 0 && (
        <ReservationManage
          data={reservations.data}
          onDelete={handleDelete}
          disableDelete={deletingId}
          loadingDelete={deleteLoading}
          getEditLink={res => `/reservation-details/${res.id}`}
        />
      )}
      <Notifiy
        message={successMessage}
        error={deleteError}
        closeSuccess={() => setSuccessMessage(null)}
        closeError={() => setError(null)}
      />
    </>
  );
}

export default ReservationAdminPage;
