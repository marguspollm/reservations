import type { Reservation } from "../models/entities/Reservation";
import { apiFetch } from "../api/apiFetch";
import { authFetch } from "../api/authFetch";
import type { ReservationRequest } from "../models/requests/ReservationRequest";
import type { Calendar } from "../models/Calendar";

export const getAllReservations = () => {
  return authFetch<Reservation[]>("/reservations");
};

export const getReservation = (id: string) => {
  return authFetch<Reservation>(`/reservations/${id}`);
};

export const createReservation = (payload: ReservationRequest) => {
  return authFetch<Reservation>("/create-reservations", {
    method: "POST",
    body: payload,
  });
};

export const updateReservation = (id: string, payload: Reservation) => {
  return authFetch<Reservation>(`/reservations/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const cancelReservation = (id: number) => {
  return authFetch<Reservation>(`/reservations/${id}`, { method: "DELETE" });
};

export const updateReservationStatus = (id: number, status: string) => {
  return authFetch<Reservation>(`/reservations/${id}`, {
    method: "PATCH",
    body: { status: status },
  });
};

export const deleteSingleReservationTime = (timeId: number) => {
  return authFetch<Reservation>(`/reservation-times/time/${timeId}`, {
    method: "DELETE",
  });
};

export const deleteInstance = (instanceId: number) => {
  return authFetch<Reservation>(`/reservation-times/instance/${instanceId}`, {
    method: "DELETE",
  });
};

export const getCalendarReservations = (
  startDate: string,
  endDate: string,
  facilityId: string,
) => {
  return apiFetch<Calendar[]>(
    `/calendar?startDate=${startDate}&endDate=${endDate}&facilityId=${facilityId}`,
  );
};

export const getActiveInstances = () => {
  return authFetch<Reservation[]>(`/active-reservations`);
};

export const getMyReservation = () => {
  return authFetch<Reservation[]>("/my-reservations");
};
