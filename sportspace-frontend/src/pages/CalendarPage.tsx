import dayjs, { Dayjs } from "dayjs";

import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";

import { DateCalendar } from "@mui/x-date-pickers";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import createCustomDay from "../components/calendar/CustomDay";
import type { Calendar } from "../models/Calendar";
import type { CalendarMode } from "../models/types/CalendarMode";
import type { Facility } from "../models/entities/Facility";
import {
  getAllActiveFacilities,
  getFacilitySchedule,
} from "../services/facility.service";
import { getCalendarReservations } from "../services/reservation.service";
import { groupReservationTimes } from "../utils/reservationUtils";
import WeekView from "../components/calendar/WeekView";
import type { FacilitySchedule } from "../models/entities/FacilitySchedule";
import { useTranslation } from "react-i18next";
import { useAsyncFetch } from "../hooks/useAsyncFetch";
import FacilitySelect from "../components/FacilitySelect";

function CalendarPage() {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reservations, setReservations] = useState<Calendar[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [mode, setMode] = useState<CalendarMode>("day");
  const [facilityId, setFacilityId] = useState("");
  const [facilitySchedule, setFacilitySchedule] = useState<FacilitySchedule[]>(
    [],
  );
  const selectedMonth = useMemo(() => {
    return selectedDate.startOf("month").format("YYYY-MM");
  }, [selectedDate]);

  const { execute, loading, error } = useAsyncFetch();

  useEffect(() => {
    if (!facilityId) return;

    const fetchSelectedDays = async () => {
      const start = dayjs(selectedMonth).startOf("month").format("YYYY-MM-DD");
      const end = dayjs(selectedMonth).endOf("month").format("YYYY-MM-DD");
      const res = await execute(
        getCalendarReservations,
        start,
        end,
        facilityId,
      );
      setReservations(res);
    };

    const fetchSelectedFacilitySchedule = async () => {
      const res = await execute(getFacilitySchedule, facilityId);
      setFacilitySchedule(res);
    };

    fetchSelectedDays();
    fetchSelectedFacilitySchedule();
  }, [facilityId, selectedMonth, execute]);

  useEffect(() => {
    const fecthAll = async () => {
      const res = await execute(getAllActiveFacilities);
      setFacilities(res);
    };

    fecthAll();
  }, [execute]);

  const groupedReservationTimes = useMemo(() => {
    return groupReservationTimes(reservations);
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    if (!selectedDate) return [];
    if (mode === "day") {
      return groupedReservationTimes[selectedDate.format("YYYY-MM-DD")] || [];
    }

    const startOfWeek = selectedDate.startOf("week");
    const endOfWeek = selectedDate.endOf("week");

    const weekReservations = [];

    let current = startOfWeek;

    while (current.isSameOrBefore(endOfWeek, "day")) {
      const key = current.format("YYYY-MM-DD");

      if (groupedReservationTimes[key]) {
        weekReservations.push(...groupedReservationTimes[key]);
      }

      current = current.add(1, "day");
    }

    return weekReservations;
  }, [selectedDate, mode, groupedReservationTimes]);

  const CustomDay = useMemo(() => {
    return createCustomDay(groupedReservationTimes, mode, selectedDate);
  }, [groupedReservationTimes, mode, selectedDate]);

  const handleSelectFacility = (e: ChangeEvent<HTMLInputElement>) => {
    setFacilityId(e.target.value);
  };

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
  };

  return (
    <Box sx={{ display: "flex", p: 3, gap: 3, flexDirection: "column" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ maxWidth: 320 }}>
        <FacilitySelect
          facilities={facilities}
          facilityId={facilityId}
          handleSelectFacility={handleSelectFacility}
        />
      </Box>
      {!facilityId ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">
            {t("calendar-page.select-facility")}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="day">{t("day")}</ToggleButton>
            <ToggleButton value="week">{t("week")}</ToggleButton>
          </ToggleButtonGroup>

          {mode == "day" ? (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ maxWidth: 320, flexShrink: 0 }}>
                {loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(255,255,255,0.6)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                )}
                <DateCalendar
                  showDaysOutsideCurrentMonth
                  value={selectedDate}
                  onChange={newDate => newDate && setSelectedDate(newDate)}
                  onMonthChange={newMonth => {
                    setSelectedDate(newMonth.date(selectedDate.date()));
                  }}
                  slots={{ day: CustomDay }}
                />
              </Box>

              <Paper
                sx={{
                  p: 2,
                  width: 360,
                  maxWidth: "100%",
                  minHeight: 200,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t("reservations")} ({selectedDate.format("DD.MM.YYYY")})
                </Typography>

                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : filteredReservations.length === 0 ? (
                  <Typography color="text.secondary">
                    {t("error.notfound.reservations")}
                  </Typography>
                ) : (
                  <List>
                    {filteredReservations.map(r => (
                      <ListItem key={r.resId} divider>
                        <ListItemText
                          primary={`${r.startTime} – ${r.endTime} • ${r.title}`}
                          secondary={`${t("room")}: ${r?.roomName}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          ) : (
            <WeekView
              selectedDate={selectedDate}
              onSelect={handleSelectDate}
              reservations={groupedReservationTimes}
              schedule={facilitySchedule}
            />
          )}
        </Paper>
      )}
    </Box>
  );
}

export default CalendarPage;
