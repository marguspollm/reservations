import type { FacilitySchedule } from "../entities/FacilitySchedule";
import type { Room } from "../entities/Room";

export type FacilityRequest = {
  name: string;
  address: string;
  rooms?: Room[];
  active: boolean;
  schedules: FacilitySchedule[];
};
