import type { DayOfWeek } from "../types/DayOfWeek";
import type { ReservationTime } from "../entities/ReservationTime";
import type { ReservationType } from "../types/ReservationType";

export type ReservationRequest = {
  title: string;
  startDate: string;
  endDate?: string;
  dayOfWeek?: DayOfWeek;
  roomId: number;
  type: ReservationType;
  reservationTimes?: ReservationTime[];
};
