import type { Facility } from "../models/entities/Facility";
import { authFetch } from "../api/authFetch";
import type { FacilitySchedule } from "../models/entities/FacilitySchedule";
import type { FacilityRequest } from "../models/requests/FacilityRequest";
import { apiFetch } from "../api/apiFetch";

export const getAllFacilities = () => {
  return authFetch<Facility[]>("/facilities");
};

export const getAllActiveFacilities = () => {
  return apiFetch<Facility[]>("/facilities/active");
};

export const getFacility = (id: string) => {
  return authFetch<Facility>(`/facilities/${id}`);
};

export const updateFacility = (id: string, payload: Facility) => {
  return authFetch<Facility>(`/facilities/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteFacility = (id: string) => {
  return authFetch<Facility[]>(`/facilities/${id}`, {
    method: "DELETE",
  });
};

export const addFacility = (payload: FacilityRequest) => {
  return authFetch<Facility>("/facilities", {
    method: "POST",
    body: payload,
  });
};

export const getFacilitySchedule = (facilityId: string) => {
  return authFetch<FacilitySchedule[]>(`/facilities/${facilityId}/schedule`);
};
