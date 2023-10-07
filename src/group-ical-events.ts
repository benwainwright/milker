import { CalendarComponent, FullCalendar } from "ical";
import { Day } from "./day";
import { DateTime } from "luxon";

const isAllDayEvent = (event: CalendarComponent) => {
  if (!event.start || !event.end) {
    return false;
  }

  const startTime = DateTime.fromJSDate(event.start).toLocaleString(
    DateTime.TIME_24_WITH_SECONDS,
  );
  const endTime = DateTime.fromJSDate(event.end).toLocaleString(
    DateTime.TIME_24_WITH_SECONDS,
  );

  const diff = DateTime.fromJSDate(event.end)
    .diff(DateTime.fromJSDate(event.start), "days")
    .toObject();

  if (
    startTime === "00:00:00" &&
    endTime === "00:00:00" &&
    (diff.days ?? 0) > 0
  ) {
    return true;
  }
  return false;
};

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
