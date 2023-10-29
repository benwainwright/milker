import { CalendarComponent } from "ical";
import { DateTime } from "luxon";
import { isAllDayEvent } from "./is-all-day-event";
import { Day } from "../../types/day";

export const groupIcalEvents = (calendar: {
  [key: string]: CalendarComponent;
}): Day[] => {
  const dayTable = Object.values(calendar).reduce<
    Record<string, CalendarComponent[]>
  >((accum, value) => {
    if (value.start) {
      const date = DateTime.fromJSDate(value.start).toLocaleString(
        DateTime.DATE_FULL,
      );

      if (isAllDayEvent(value)) {
        return accum;
      }

      if (date in accum) {
        return { ...accum, [date]: [...accum[date], value] };
      }
      return { ...accum, [date]: [value] };
    }
    return accum;
  }, {});

  return Object.values(dayTable)
    .map((events) => ({
      day: DateTime.fromJSDate(events[0].start!).startOf("day"),
      events,
    }))
    .slice()
    .sort((a, b) => (a.day > b.day ? 1 : -1));
};
