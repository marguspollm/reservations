import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { Facility } from "../../models/entities/Facility";
import type { Room } from "../../models/entities/Room";
import {
  DAY_TO_NUMBER,
  DAYS,
  reservationRequestObject,
} from "../../utils/objects";
import {
  getAllActiveFacilities,
  getFacilitySchedule,
} from "../../services/facility.service";
import { createReservation } from "../../services/reservation.service";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { FacilitySchedule } from "../../models/entities/FacilitySchedule";
import type { RoomAvailability } from "../../models/RoomAvailability";
import {
  getAllFacilityRooms,
  getRoomAvailablity,
} from "../../services/room.service";
import dayjs from "../../utils/dayjs";
import type { ReservationRequest } from "../../models/requests/ReservationRequest";
import Loading from "../../components/Loading";
import { t } from "i18next";
import { validateReservationCreationForm } from "../../utils/validations";
import { useAsyncFetch } from "../../hooks/useAsyncFetch";
import type { ReservationFormError } from "../../models/FormErrors";
import Notifiy from "../../components/Notifiy";
import FacilitySelect from "../../components/FacilitySelect";

function ReservationCreatePage() {
  const { user, isLoading } = useContext(AuthContext);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [facilityId, setFacilityId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [schedule, setSchedule] = useState<FacilitySchedule[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [availability, setAvailability] = useState<RoomAvailability | null>(
    null,
  );
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);

  const [form, setForm] = useState<ReservationRequest>({
    ...reservationRequestObject,
  });

  const [formErrors, setFormErrors] = useState<ReservationFormError>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { execute, loading } = useAsyncFetch();

  useEffect(() => {
    const fetchAllFacilities = async () => {
      const res = await execute(getAllActiveFacilities);
      setFacilities(res);
    };

    fetchAllFacilities();
  }, [execute]);

  useEffect(() => {
    if (!facilityId) return;

    const fetchRooms = async () => {
      const res = await execute(getAllFacilityRooms, facilityId);
      setRooms(res);
    };

    const fetchSchedule = async () => {
      const res = await execute(getFacilitySchedule, facilityId);
      setSchedule(res);
    };

    fetchRooms();
    fetchSchedule();
  }, [facilityId, execute]);

  useEffect(() => {
    if (!roomId || !selectedStartDate) return;

    const fetchAvailableTimes = async () => {
      setAvailability(null);
      setSelectedSlots([]);
      setFormErrors({});
      try {
        const res = await execute(
          getRoomAvailablity,
          roomId,
          selectedStartDate,
        );
        if (res.availableSlots.length === 0) {
          setError(t("error.notfound.availabletimes"));
          return;
        }
        setAvailability(res);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };

    fetchAvailableTimes();
  }, [roomId, selectedStartDate, execute]);

  const daySchedule = useMemo(() => {
    const map = new Map<number, FacilitySchedule>();

    schedule.forEach(s => {
      map.set(DAY_TO_NUMBER[s.dayOfWeek], s);
    });

    return map;
  }, [schedule]);

  const handleChange = useCallback((name: string, value: unknown) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectFacility = (value: string) => {
    setFacilityId(value);
    setRoomId("");
    setSelectedStartDate(null);
    setAvailability(null);
    setSelectedEndDate("");
    setSelectedSlots([]);
  };

  const handleDateChange = (value: string) => {
    setAvailability(null);
    setSelectedSlots([]);

    if (!value) {
      setFormErrors(prev => ({ ...prev, startDate: "" }));
      return;
    }

    if (checkEndDateIsBeforeStartDate(value, selectedEndDate)) return;

    setSelectedStartDate(value);
    setForm(prev => ({
      ...prev,
      dayOfWeek: DAYS[dayjs(value).day()],
      startDate: value,
    }));

    const day = dayjs(value).day();
    const dayScheduled = daySchedule.get(day);

    if (!dayScheduled) {
      setFormErrors(prev => ({
        ...prev,
        startDate: t("error.notfound.opentimes"),
      }));
      return;
    }
  };

  const handleSlotAdd = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSlots(
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const handleEndDate = (value: string) => {
    setFormErrors(prev => ({ ...prev, endDate: "" }));
    if (!selectedStartDate) return;
    if (checkEndDateIsBeforeStartDate(selectedStartDate, value)) return;

    setSelectedEndDate(value);
    setForm(prev => ({ ...prev, endDate: value }));
  };

  const checkEndDateIsBeforeStartDate = (start?: string, end?: string) => {
    if (!start || !end) return;
    const isBefore = dayjs(end).isBefore(start);

    if (isBefore) {
      setFormErrors(prev => ({
        ...prev,
        endDate: t("error.invalid.endbeforestartdate"),
      }));
      return true;
    }

    return false;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomId || !user?.id || !selectedStartDate || loading) return;

    const payload: ReservationRequest = {
      ...form,
      roomId: Number(roomId),
    };

    const validated = validateReservationCreationForm(
      form,
      selectedSlots,
      availability,
    );

    if (Object.keys(validated).length !== 0 || !availability) {
      setFormErrors(validated);
      return;
    }

    if (form.type === "SINGLE_DAY" || form.type === "WEEKLY") {
      payload.reservationTimes = selectedSlots
        .map(i => availability.availableSlots[i])
        .filter(Boolean)
        .map(slot => {
          return {
            date: selectedStartDate,
            startTime: slot?.startTime,
            endTime: slot?.endTime,
          };
        });

      payload.endDate = selectedStartDate;
    }

    if (form.type === "WEEKLY" || form.type === "MULTI_DAY") {
      payload.endDate = selectedEndDate;
    }

    if (form.type === "WEEKLY") {
      payload.dayOfWeek = form.dayOfWeek;
    }

    try {
      await execute(createReservation, payload);
      setSuccessMessage(t("success.reservation.created"));
      setForm({ ...reservationRequestObject });
      setSelectedStartDate(null);
      setSelectedEndDate("");
      setAvailability(null);
      setSelectedSlots([]);
      setFormErrors({});
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (isLoading && user?.id) return <Loading open />;

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={600}>
            {t("res.page.header")}
          </Typography>

          <Divider />
          <TextField
            label={t("res.form.title")}
            value={form.title}
            onChange={e => handleChange("title", e.target.value)}
            required
            error={!!formErrors.title}
            helperText={formErrors.title}
          ></TextField>

          <FormControl fullWidth>
            <InputLabel>{t("res.form.type")}</InputLabel>
            <Select
              value={form.type}
              label="Reservation Type"
              onChange={e => handleChange("type", e.target.value)}
              error={!!formErrors.type}
            >
              <MenuItem value="SINGLE_DAY">{t("res.type.singleday")}</MenuItem>
              <MenuItem value="WEEKLY">{t("res.type.weekly")}</MenuItem>
              <MenuItem value="MULTI_DAY">{t("res.type.multy")}</MenuItem>
            </Select>
          </FormControl>

          <FacilitySelect
            facilities={facilities}
            facilityId={facilityId}
            handleSelectFacility={e => handleSelectFacility(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label={t("res.form.room")}
            value={roomId}
            disabled={!facilityId}
            onChange={e => setRoomId(e.target.value)}
            error={!!formErrors.roomId}
            helperText={formErrors.roomId}
          >
            {rooms.map(r => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              type="date"
              label={t("res.form.startdate")}
              value={selectedStartDate || ""}
              disabled={!roomId}
              error={!!formErrors?.startDate}
              helperText={formErrors?.startDate}
              onChange={e => handleDateChange(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            {(form.type === "WEEKLY" || form.type === "MULTI_DAY") &&
              selectedStartDate && (
                <TextField
                  fullWidth
                  type="date"
                  label={t("res.form.enddate")}
                  value={selectedEndDate ?? ""}
                  onChange={e => handleEndDate(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                />
              )}
          </Stack>

          {form.type === "WEEKLY" && selectedStartDate && (
            <FormControl fullWidth>
              <InputLabel>{t("res.form.weekday")}</InputLabel>
              <Select
                value={DAYS[dayjs(selectedStartDate).day()] ?? DAYS[1]}
                label={t("res.form.weekday")}
                onChange={e => handleChange("dayOfWeek", e.target.value)}
                error={!!formErrors.dayOfWeek}
              >
                {Object.entries(DAYS).map(([key, val]) => (
                  <MenuItem key={key} value={val}>
                    {t(`opening-hours.days.${val}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {availability &&
            (form.type === "SINGLE_DAY" || form.type === "WEEKLY") &&
            selectedStartDate && (
              <Box>
                <Fade in={!!availability}>
                  <Box>
                    {availability && (
                      <FormControl
                        fullWidth
                        error={!!formErrors.reservationTimes}
                      >
                        <InputLabel>{t("res.form.availableslots")}</InputLabel>
                        <Select
                          multiple
                          value={selectedSlots}
                          onChange={handleSlotAdd}
                          input={
                            <OutlinedInput
                              label={t("res.form.availableslots")}
                            />
                          }
                          renderValue={selected =>
                            selected
                              .map(i => {
                                const s = availability.availableSlots[i];
                                return `${s.startTime} - ${s.endTime}`;
                              })
                              .join(", ")
                          }
                        >
                          {availability.availableSlots.map((slot, index) => (
                            <MenuItem key={index} value={index}>
                              <Checkbox
                                checked={selectedSlots.includes(index)}
                              />
                              <ListItemText
                                primary={`${slot.startTime} – ${slot.endTime}`}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                        {formErrors.reservationTimes && (
                          <Typography color="error" variant="caption">
                            {t("error.required.atleastonetime")}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  </Box>
                </Fade>
              </Box>
            )}
          {error && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!roomId || !selectedStartDate}
            loading={loading}
            sx={{ mt: 2 }}
          >
            {t("button.reserv")}
          </Button>
        </Stack>
      </CardContent>
      <Notifiy
        error={error}
        message={successMessage}
        closeSuccess={() => setSuccessMessage(null)}
        closeError={() => setError(null)}
      />
    </Card>
  );
}

export default ReservationCreatePage;
