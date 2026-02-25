import { Dayjs } from "dayjs";
import dayjs from "./dayjs";
import type { Calendar } from "../models/Calendar";
import type { CalendarResrvationInstance } from "../models/CalendatReservationInstance";

export const matchesReservation = (date: Dayjs, res: string): boolean => {
  return date.isSame(dayjs(res), "day");
};

export const countReservationsForDay = (
  date: Dayjs,
  calendarReservations: Record<string, CalendarResrvationInstance[]>,
): number => {
  return calendarReservations[date.format("YYYY-MM-DD")]?.length || 0;
};

export const groupReservationTimes = (calendarReservations: Calendar[]) => {
  const result: Record<string, CalendarResrvationInstance[]> = {};

  for (const reservation of calendarReservations) {
    for (const instance of reservation.instances) {
      if (!instance.times.length) continue;

      const { earliestStart, latestEnd } = instance;

      const entry: CalendarResrvationInstance = {
        date: instance.date,
        startTime: earliestStart,
        endTime: latestEnd,
        resId: reservation.id,
        title: reservation.title,
        roomName: reservation.roomName,
        instanceId: instance.id || 0,
      };

      const key = dayjs(instance.date).format("YYYY-MM-DD");
      if (!result[key]) result[key] = [];
      result[key].push(entry);
    }
  }

  for (const dateKey in result) {
    result[dateKey].sort(
      (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
    );
  }

  return result;
};

export const getStatusColor = (status: string = "") => {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "warning";
  }
};

export const formatDate = (date: string) => {
  return dayjs(date).local().format("dddd, MMMM D, YYYY");
};
