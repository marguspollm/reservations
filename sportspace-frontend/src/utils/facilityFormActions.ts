import type { Facility } from "../models/entities/Facility";
import type { FacilityRequest } from "../models/requests/FacilityRequest";
import type { DayOfWeek } from "../models/types/DayOfWeek";

export function facilityFormActions<
  T extends Facility | FacilityRequest | null,
>(setFacility: React.Dispatch<React.SetStateAction<T>>) {
  const addRoom = () => {
    setFacility(prev =>
      prev
        ? {
            ...prev,
            rooms: [
              ...(prev.rooms ?? []),
              { name: "", sportType: "", price: 0, active: true },
            ],
          }
        : prev,
    );
  };

  const updateRoom = (index: number, field: string, value: unknown) => {
    setFacility(prev =>
      prev
        ? {
            ...prev,
            rooms: (prev.rooms ?? []).map((room, i) =>
              i === index ? { ...room, [field]: value } : room,
            ),
          }
        : prev,
    );
  };

  const deleteRoom = (index: number) => {
    setFacility(prev =>
      prev
        ? {
            ...prev,
            rooms: (prev.rooms ?? []).filter((_, i) => i !== index),
          }
        : prev,
    );
  };

  const toggleDay = (day: DayOfWeek) => {
    setFacility(prev => {
      if (!prev) return prev;

      const schedules = prev.schedules ?? [];
      const exists = schedules.some(s => s.dayOfWeek === day);

      return {
        ...prev,
        schedules: exists
          ? schedules.filter(s => s.dayOfWeek !== day)
          : [
              ...schedules,
              { dayOfWeek: day, openTime: "08:00", closeTime: "17:00" },
            ],
      };
    });
  };

  const updateTime = (
    day: DayOfWeek,
    field: "openTime" | "closeTime",
    value: string,
  ) => {
    setFacility(prev =>
      prev
        ? {
            ...prev,
            schedules: (prev.schedules ?? []).map(s =>
              s.dayOfWeek === day ? { ...s, [field]: value } : s,
            ),
          }
        : prev,
    );
  };

  return {
    addRoom,
    updateRoom,
    deleteRoom,
    toggleDay,
    updateTime,
  };
}
