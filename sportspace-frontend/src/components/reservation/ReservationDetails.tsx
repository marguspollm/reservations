import {
  Container,
  Card,
  CardHeader,
  Stack,
  Typography,
  Chip,
  Divider,
  CardContent,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { getStatusColor } from "../../utils/reservationUtils";
import {
  cancelReservation,
  deleteInstance,
  deleteSingleReservationTime,
  getReservation,
  updateReservation,
  updateReservationStatus,
} from "../../services/reservation.service";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import NotFound from "../../pages/NotFound";
import { useAsyncFetch } from "../../hooks/useAsyncFetch";
import { useParams } from "react-router";

import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import type { Reservation } from "../../models/entities/Reservation";
import ReservationTimes from "./ReservationTimes";
import Notifiy from "../Notifiy";
import { isChanged } from "../../utils/validations";

type ReservationDetailsProps = {
  canEdit?: boolean;
  canDeleteTimes?: boolean;
  canSetStatus?: boolean;
};
function ReservationDetails({
  canEdit,
  canDeleteTimes,
  canSetStatus,
}: ReservationDetailsProps) {
  const { reservationId } = useParams();
  const { t } = useTranslation();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [originalReservation, setOriginalReservation] =
    useState<Reservation | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { execute, error, loading } = useAsyncFetch();

  useEffect(() => {
    if (!reservationId) return;

    const fetchReservation = async (reservationId: string) => {
      const data = await execute(getReservation, reservationId);

      setReservation(data);
      setOriginalReservation(data);
      setInitialized(true);
    };

    fetchReservation(reservationId);
  }, [reservationId, execute]);

  const isDirty = useMemo(() => {
    return isChanged(reservation, originalReservation);
  }, [reservation, originalReservation]);

  const handleChange = (name: string, value: string) => {
    setReservation(prev => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!reservationId || !reservation) return;

    const updated = await execute(
      updateReservation,
      reservationId,
      reservation,
    );

    setReservation(updated);
    setOriginalReservation(updated);
    setSuccessMessage(t("success.reservation.updated"));
  };

  const handleCancel = () => {
    setReservation(originalReservation);
  };

  const onDeleteInstance = async (e: React.MouseEvent, instanceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!instanceId) return;

    const updated = await execute(deleteInstance, instanceId);

    setReservation(updated);
    setOriginalReservation(updated);
  };

  const onDeleteTime = async (e: React.MouseEvent, id?: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;

    const updated = await execute(deleteSingleReservationTime, id);
    setReservation(updated);
    setOriginalReservation(updated);
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    (document.activeElement as HTMLElement | null)?.blur();
    const value = e.target.value;

    if (!reservation) return;

    handleChange("status", value);
    if (!reservation.id || reservation.status === value) return;

    const updated = await execute(
      updateReservationStatus,
      reservation.id,
      value,
    );
    setReservation(updated);
    setOriginalReservation(updated);
  };

  const handlecancelReservation = async (id: number) => {
    const updated = await execute(cancelReservation, id);
    setReservation(updated);
    setOriginalReservation(updated);
  };

  if (loading || !initialized) return <Loading open />;

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!reservation || !originalReservation) return <NotFound />;

  const disabled = reservation
    ? reservation.status === "CONFIRMED" || reservation.status === "CANCELLED"
    : true;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Card elevation={3}>
        <CardHeader
          title={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight={600}>
                {t("res.details.header")}
              </Typography>
              <Chip
                label={originalReservation.status}
                color={getStatusColor(originalReservation.status)}
              />
              <Button
                type="button"
                color="warning"
                loading={loading}
                disabled={disabled}
                onClick={() => {
                  if (reservation.id !== undefined)
                    handlecancelReservation(reservation.id);
                }}
              >
                {t("button.cancel-res")}
              </Button>
            </Stack>
          }
        />

        <Divider />

        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid>
                <Typography variant="subtitle2" gutterBottom>
                  {t("res.details.gen-info")}
                </Typography>

                <TextField
                  label={t("res.form.id")}
                  value={reservation.id ?? ""}
                  fullWidth
                  margin="normal"
                  disabled
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />

                <TextField
                  label={t("res.form.title")}
                  name="title"
                  value={reservation.title ?? ""}
                  onChange={e => handleChange("title", e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  disabled={canEdit && !!disabled}
                />

                <TextField
                  label={t("res.form.room")}
                  value={reservation.roomId ?? ""}
                  fullWidth
                  margin="normal"
                  disabled
                />

                <TextField
                  label={t("res.details.user")}
                  value={reservation.userId ?? ""}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>

              <Grid>
                <Typography variant="subtitle2" gutterBottom>
                  {t("res.details.settings")}
                </Typography>

                <TextField
                  label={t("res.form.type")}
                  value={reservation.type ?? ""}
                  fullWidth
                  margin="normal"
                  disabled
                />
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <TextField
                  select
                  label={t("res.details.status")}
                  name="status"
                  value={reservation.status ?? ""}
                  onChange={handleStatusChange}
                  fullWidth
                  margin="normal"
                  disabled={!canSetStatus}
                >
                  <MenuItem value="REQUESTED">
                    {t("res.status.requested")}
                  </MenuItem>
                  <MenuItem value="CONFIRMED">
                    {t("res.status.confirmed")}
                  </MenuItem>
                  <MenuItem value="CANCELLED">
                    {t("res.status.cancelled")}
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <ReservationTimes
              reservation={reservation}
              deleteInstance={onDeleteInstance}
              deleteTime={onDeleteTime}
              canEdit={canEdit}
              canDeleteTimes={canDeleteTimes}
              disabled={disabled}
            />

            <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                loading={loading}
                disabled={!isDirty}
              >
                {t("button.cancel-changes")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                disabled={!isDirty}
              >
                {t("button.save-changes")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Notifiy
        message={successMessage}
        closeSuccess={() => setSuccessMessage(null)}
      />
    </Container>
  );
}

export default ReservationDetails;
