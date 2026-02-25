import {
  Stack,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
} from "@mui/material";
import type { FacilitySchedule } from "../../models/entities/FacilitySchedule";
import type { DayOfWeek } from "../../models/types/DayOfWeek";
import { useTranslation } from "react-i18next";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { DAYS } from "../../utils/objects";

type OpeningHoursProps = {
  schedules: FacilitySchedule[];
  toggleDay: (day: DayOfWeek) => void;
  updateTime: (
    day: DayOfWeek,
    field: "openTime" | "closeTime",
    value: string,
  ) => void;
};

function OpeningHours({ schedules, toggleDay, updateTime }: OpeningHoursProps) {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        {t("opening-hours.header")}
      </Typography>

      <Stack spacing={2}>
        {(Object.values(DAYS) as DayOfWeek[]).map(day => {
          const schedule = schedules.find(s => s.dayOfWeek === day);
          const isActive = Boolean(schedule);

          return (
            <Paper
              key={day}
              variant="outlined"
              sx={{
                p: 2,
                opacity: isActive ? 1 : 0.7,
                transition: "0.2s",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={() => toggleDay(day)}
                      />
                    }
                    label={
                      <Typography fontWeight={500}>
                        {t(`opening-hours.days.${day}`)}
                      </Typography>
                    }
                  />
                </Grid>

                {isActive && schedule && (
                  <>
                    <Grid>
                      <TimePicker
                        label={t("opening-hours.start")}
                        value={
                          schedule.openTime
                            ? dayjs(schedule.openTime, "HH:mm")
                            : null
                        }
                        onChange={newValue =>
                          updateTime(
                            day,
                            "openTime",
                            newValue ? newValue.format("HH:mm") : "",
                          )
                        }
                        ampm={false}
                        minutesStep={30}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </Grid>

                    <Grid>
                      <TimePicker
                        label={t("opening-hours.close")}
                        value={
                          schedule.closeTime
                            ? dayjs(schedule.closeTime, "HH:mm")
                            : null
                        }
                        onChange={newValue =>
                          updateTime(
                            day,
                            "closeTime",
                            newValue ? newValue.format("HH:mm") : "",
                          )
                        }
                        ampm={false}
                        minutesStep={30}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}

export default OpeningHours;
