import { DateTime } from "luxon";
import { PlannedDay } from "./planned-day";

export const generateInBetweenDays = (rawDays: PlannedDay[]) => {
  const today = DateTime.now().startOf("day");

  const todayWrapped = rawDays[0].newWithRules({
    day: DateTime.now().startOf("day"),
    events: [],
  });

  const daysIncludingToday =
    rawDays[0].rawDay.day.startOf("day") === today
      ? rawDays
      : [todayWrapped, ...rawDays];

  const everythingBeforeFinalDay = daysIncludingToday.flatMap(
    (day, index, array) => {
      if (index === array.length - 1) {
        return [];
      }
      const nextDay = array[index + 1];

      const extraDayCount =
        (nextDay.rawDay.day
          .startOf("day")
          .diff(day.rawDay.day.startOf("day"), ["days", "hours"])
          .toObject().days ?? 1) - 1;

      const extraDays = Array.from({ length: extraDayCount }).map((_, index) =>
        day.newWithRules({
          events: [],
          day: DateTime.fromMillis(day.rawDay.day.toMillis()).plus({
            days: index + 1,
          }),
        }),
      );

      return [day, ...extraDays];
    },
  );

  return [...everythingBeforeFinalDay, rawDays[rawDays.length - 1]];
};
