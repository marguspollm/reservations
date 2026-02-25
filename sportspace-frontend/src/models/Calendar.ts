import type { ReservationInstance } from "./entities/ReservationInstance";

export type Calendar = {
  id: number;
  title: string;
  roomId: number;
  roomName: string;
  facilityId: number;
  facilityName: string;
  price: number;
  instances: ReservationInstance[];
};
