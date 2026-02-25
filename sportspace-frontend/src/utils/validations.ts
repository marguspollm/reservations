import type {
  AttendeeFormError,
  FacilityFormError,
  FormError,
  ReservationFormError,
} from "../models/FormErrors";
import type { Signup } from "../models/requests/Signup";
import { t } from "i18next";
import type { RoomAvailability } from "../models/RoomAvailability";
import type { ReservationRequest } from "../models/requests/ReservationRequest";
import type { User } from "../models/entities/User";
import type { Facility } from "../models/entities/Facility";
import type { FacilityRequest } from "../models/requests/FacilityRequest";

export const validateSignupForm = (formData: Signup) => {
  const errors: FormError = {};
  if (formData.email === "") {
    errors.email = t("error.required.email");
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = t("error.invalid.email");
  }
  if (formData.password === "") {
    errors.password = t("error.required.password");
  }
  if (formData.firstname === "") {
    errors.firstname = t("error.required.firstname");
  }

  return errors;
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: FormError = {};
  if (!email) {
    errors.email = t("error.required.email");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = t("error.invalid.email");
  }
  if (!password) {
    errors.password = t("error.required.password");
  }

  return errors;
};

export const validateReservationCreationForm = (
  form: ReservationRequest,
  selectedSlots: number[],
  availability: RoomAvailability | null,
) => {
  const errors: ReservationFormError = {};
  if (!form.title) errors.title = t("error.required.title");
  if (!form.startDate) errors.startDate = t("error.required.startdate");
  if (form.type === "SINGLE_DAY" || form.type === "WEEKLY") {
    if (selectedSlots.length === 0) {
      errors.reservationTimes = t("error.required.atleastonetime");
    }
    if (!availability) {
      errors.reservationTimes = t("error.notfound.availabletimes");
    }
  }

  if (form.type === "WEEKLY" || form.type === "MULTI_DAY") {
    if (!form.endDate) {
      errors.endDate = t("error.required.enddate");
    }
  }

  return errors;
};

export const validateUser = (formData: User) => {
  const errors: FormError = {};
  if (!formData.email) {
    errors.email = t("error.required.email");
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = t("error.invalid.email");
  }
  if (!formData.firstname) {
    errors.firstname = t("error.required.firstname");
  }

  return errors;
};

export const validateFacilityForm = (formData: Facility | FacilityRequest) => {
  const errors: FacilityFormError = {};
  if (!formData.name) errors.name = t("error.required.facilityname");
  if (!formData.address) errors.address = t("error.required.facilityaddress");
  if (!formData.schedules.length)
    errors.schedules = t("error.required.facilityschedules");
  if (
    formData.rooms?.length &&
    formData.rooms.filter(room => room.name.trim().length === 0).length
  )
    errors.rooms = t("error.required.roomname");

  return errors;
};

export const validateAttendeeForm = (
  email: string,
  name: string,
  id?: number,
) => {
  const errors: AttendeeFormError = {};
  if (!email && !name && !id)
    errors.general = t("error.required.atleastoneAttendeevalue");
  if (!id && !name) errors.name = t("error.required.atleastAttendeename");

  return errors;
};

export const isChanged = (change: unknown, original: unknown) => {
  if (!change || !original) return false;
  return JSON.stringify(change) !== JSON.stringify(original);
};
