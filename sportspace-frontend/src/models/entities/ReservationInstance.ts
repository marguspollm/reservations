import type { ReservationTime } from "./ReservationTime";

export type ReservationInstance = {
  id?: number;
  date: string;
  reservationId: number;
  times: ReservationTime[];
  earliestStart: string;
  latestEnd: string;
};
