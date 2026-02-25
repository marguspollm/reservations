import { authFetch } from "../api/authFetch";
import type { Room } from "../models/entities/Room";
import type { RoomAvailability } from "../models/RoomAvailability";

export const getRoomAvailablity = (roomId: string, selectedDate: string) => {
  return authFetch<RoomAvailability>(
    `/rooms/${roomId}/availability?date=${selectedDate}`,
  );
};

export const getAllFacilityRooms = (facilityId: string) => {
  return authFetch<Room[]>(`/facilities/${facilityId}/rooms`);
};

export const deleteRoomId = (roomId: number) => {
  return authFetch<void>(`/rooms/${roomId}`, { method: "DELETE" });
};
