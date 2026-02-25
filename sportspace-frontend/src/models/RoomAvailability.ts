import type { TimeSlot } from "./TimeSlot";

export type RoomAvailability = {
  roomId: number;
  date: string;
  openTime: string;
  endTime: string;
  availableSlots: TimeSlot[];
};
