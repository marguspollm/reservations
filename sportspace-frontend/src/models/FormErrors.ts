export type FormError = {
  email?: string;
  password?: string;
  firstname?: string;
};

export type ReservationFormError = {
  title?: string;
  startDate?: string;
  endDate?: string;
  dayOfWeek?: string;
  roomId?: string;
  type?: string;
  reservationTimes?: string;
};

export type UserError = {
  email?: string;
  firstname?: string;
};

export type FacilityFormError = {
  name?: string;
  address?: string;
  schedules?: string;
  rooms?: string;
};

export type AttendeeFormError = {
  general?: string;
  email?: string;
  name?: string;
  userId?: string;
};
