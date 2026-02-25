import { Alert } from "@mui/material";
import ReservationManage from "../../components/reservation/ReservationManage";
import { getMyReservation } from "../../services/reservation.service";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";

function MyReservations() {
  const { t } = useTranslation();
  const {
    data: reservations,
    error,
    loading,
  } = useFetch(() => getMyReservation());

  if (loading) return <Loading open />;
  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  if (!reservations)
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {t("no-reservations")}
      </Alert>
    );

  return (
    <>
      <ReservationManage
        data={reservations}
        getEditLink={res => `/my-reservations/${res.id}`}
      />
    </>
  );
}

export default MyReservations;
