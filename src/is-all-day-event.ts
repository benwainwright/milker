import { CalendarComponent } from "ical";
import { DateTime } from "luxon";

export const isAllDayEvent = (event: CalendarComponent) => {
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
