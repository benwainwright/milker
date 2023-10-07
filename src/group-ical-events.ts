import { CalendarComponent, FullCalendar } from "ical";
import { Day } from "./day";
import { DateTime } from "luxon";

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
