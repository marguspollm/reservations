import type { ReservationStatus } from "../types/ReservationStatus";
import type { ReservationType } from "../types/ReservationType";
import type { ReservationInstance } from "./ReservationInstance";

export type Reservation = {
  id: number;
  title: string;
  userId: number;
  roomId: number;
  status: ReservationStatus;
  type: ReservationType;
  instances: ReservationInstance[];
};
