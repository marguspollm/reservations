import { authFetch } from "../api/authFetch";
import type { Attendee } from "../models/entities/Attendee";

export const getAllAttendees = (id: number) => {
  return authFetch<Attendee[]>(`/reservations/${id}/attendees`);
};

export const addAttendee = (id: number, payload: Attendee) => {
  return authFetch<Attendee>(`/reservations/${id}/attendees`, {
    method: "POST",
    body: payload,
  });
};

export const deleteAttendee = (resId: number, id: number) => {
  return authFetch<Attendee[]>(`/reservations/${resId}/attendees/${id}`, {
    method: "DELETE",
  });
};
