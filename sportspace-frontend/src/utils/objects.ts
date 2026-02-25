import type { DayOfWeek } from "../models/types/DayOfWeek";
import type { FacilityRequest } from "../models/requests/FacilityRequest";
import type { ReservationRequest } from "../models/requests/ReservationRequest";
import type { Signup } from "../models/requests/Signup";

export const signupObject: Signup = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  phoneNumber: "",
};

export const facilityObject: FacilityRequest = {
  name: "",
  address: "",
  active: true,
  rooms: [],
  schedules: [],
};

export const reservationRequestObject: ReservationRequest = {
  title: "",
  startDate: "",
  roomId: 0,
  type: "SINGLE_DAY",
  reservationTimes: [],
};

export const DAYS: Record<number, DayOfWeek> = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
  0: "SUNDAY",
};

export const DAY_TO_NUMBER = Object.fromEntries(
  Object.entries(DAYS).map(([key, value]) => [value, Number(key)]),
) as Record<DayOfWeek, number>;
