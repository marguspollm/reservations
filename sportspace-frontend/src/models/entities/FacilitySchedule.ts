import type { DayOfWeek } from "../types/DayOfWeek";

export type FacilitySchedule = {
  id?: number;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
};
