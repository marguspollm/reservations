import type { FacilitySchedule } from "./FacilitySchedule";
import type { Room } from "./Room";

export type Facility = {
  id: number;
  name: string;
  address: string;
  rooms: Room[];
  active: boolean;
  schedules: FacilitySchedule[];
};
