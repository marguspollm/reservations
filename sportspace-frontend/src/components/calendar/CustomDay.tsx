import { Badge } from "@mui/material";
import { PickersDay, type PickersDayProps } from "@mui/x-date-pickers";
import type { CalendarMode } from "../../models/types/CalendarMode";
import type { Dayjs } from "dayjs";
import { countReservationsForDay } from "../../utils/reservationUtils";
import type { CalendarResrvationInstance } from "../../models/CalendatReservationInstance";

export default function createCustomDay(
  groupedReservationTimes: Record<string, CalendarResrvationInstance[]>,
  mode: CalendarMode,
  selectedDate: Dayjs,
) {
  return function CustomDay(props: PickersDayProps) {
    const { day, outsideCurrentMonth, ...other } = props;

    const count = countReservationsForDay(day, groupedReservationTimes);

    const isSelected =
      mode === "week"
        ? day.isSame(selectedDate, "week")
        : day.isSame(selectedDate, "day");

    return (
      <Badge
        overlap="circular"
        badgeContent={count}
        color="primary"
        invisible={count === 0}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          selected={isSelected}
        />
      </Badge>
    );
  };
}
