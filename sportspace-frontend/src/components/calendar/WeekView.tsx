import { Dayjs } from "dayjs";
import { Box, Button, Typography } from "@mui/material";
import type { FacilitySchedule } from "../../models/entities/FacilitySchedule";
import { DAYS } from "../../utils/objects";
import { useTranslation } from "react-i18next";
import type { CalendarResrvationInstance } from "../../models/CalendatReservationInstance";

type WeekViewProps = {
  selectedDate: Dayjs;
  onSelect: (date: Dayjs) => void;
  reservations: Record<string, CalendarResrvationInstance[]>;
  schedule: FacilitySchedule[];
};

function WeekView({
  selectedDate,
  onSelect,
  reservations,
  schedule,
}: WeekViewProps) {
  const { t } = useTranslation();
  const HOUR_HEIGHT = 60;
  const DAY_HEIGHT = 24 * HOUR_HEIGHT;

  const startOfWeek = selectedDate.startOf("week");
  const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Button onClick={() => onSelect(selectedDate.subtract(1, "week"))}>
          {t("button.previous")}
        </Button>

        <Typography variant="h6">
          {startOfWeek.format("DD MMM")} –{" "}
          {startOfWeek.add(6, "day").format("DD MMM YYYY")}
        </Typography>

        <Button onClick={() => onSelect(selectedDate.add(1, "week"))}>
          {t("button.next")}
        </Button>
      </Box>

      <Box sx={{ overflow: "auto", height: "calc(100vh - 120px)" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "50px repeat(7, minmax(0, 1fr))",
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 30,
              backgroundColor: "background.paper",
            }}
          />

          {days.map(day => (
            <Box
              key={day.format("YYYY-MM-DD")}
              sx={{
                textAlign: "center",
                p: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
              }}
              onClick={() => onSelect(day)}
            >
              <Typography variant="body2">{day.format("ddd")}</Typography>
              <Typography variant="subtitle2">{day.format("DD")}</Typography>
            </Box>
          ))}

          <Box sx={{ position: "sticky", height: DAY_HEIGHT, left: 0 }}>
            {Array.from({ length: 24 }).map((_, hour) => (
              <Box
                key={hour}
                sx={{
                  position: "absolute",
                  top: hour * HOUR_HEIGHT,
                  height: HOUR_HEIGHT,
                  width: "100%",
                  borderTop: "1px solid",
                  borderColor: "divider",
                  fontSize: 12,
                  textAlign: "right",
                  pr: 1,
                }}
              >
                {`${hour.toString().padStart(2, "0")}:00`}
              </Box>
            ))}
          </Box>

          {days.map(day => {
            const dayKey = day.format("YYYY-MM-DD");
            const dayReservations = reservations[dayKey] ?? [];
            const weekday = day.day();
            const hoursConfig: FacilitySchedule | undefined = schedule.find(
              x => x.dayOfWeek === DAYS[weekday],
            );

            let openMinutes = 0;
            let closeMinutes = 24 * 60;

            if (hoursConfig) {
              const [openH, openM] = hoursConfig.openTime
                .split(":")
                .map(Number);
              const [closeH, closeM] = hoursConfig.closeTime
                .split(":")
                .map(Number);

              openMinutes = openH * 60 + openM;
              closeMinutes = closeH * 60 + closeM;
            }

            return (
              <Box
                key={dayKey}
                sx={{
                  position: "relative",
                  height: DAY_HEIGHT,
                  borderLeft: "1px solid",
                  borderColor: "divider",
                }}
              >
                {!hoursConfig && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "action.disabledBackground",
                      opacity: 0.5,
                      pointerEvents: "none",
                    }}
                  />
                )}
                {hoursConfig && openMinutes > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      height: (openMinutes / 60) * HOUR_HEIGHT,
                      left: 0,
                      right: 0,
                      backgroundColor: "action.disabledBackground",
                      opacity: 0.4,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {hoursConfig && closeMinutes < 24 * 60 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: (closeMinutes / 60) * HOUR_HEIGHT,
                      height: ((24 * 60 - closeMinutes) / 60) * HOUR_HEIGHT,
                      left: 0,
                      right: 0,
                      backgroundColor: "action.disabledBackground",
                      opacity: 0.4,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {hoursConfig &&
                  dayReservations.map(r => {
                    const [startH, startM] = r.startTime.split(":").map(Number);
                    const [endH, endM] = r.endTime.split(":").map(Number);

                    const startMinutes = startH * 60 + startM;
                    const endMinutes = endH * 60 + endM;

                    const durationMinutes = endMinutes - startMinutes;

                    return (
                      <Box
                        key={r.resId}
                        sx={{
                          position: "absolute",
                          top: (startMinutes / 60) * HOUR_HEIGHT,
                          height: (durationMinutes / 60) * HOUR_HEIGHT,
                          left: 4,
                          right: 4,
                          backgroundColor: "primary.main",
                          color: "white",
                          borderRadius: 1,
                          p: 0.5,
                          fontSize: 12,
                          overflow: "hidden",
                        }}
                      >
                        {r.startTime} – {r.endTime}
                        <br />
                        {r.title}
                      </Box>
                    );
                  })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default WeekView;
