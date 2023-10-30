import { DateTime } from "luxon";
import { vi } from "vitest";
import { PlannedDay } from "./planned-day";
import { generateInBetweenDays } from "./generate-in-between-days";

test("generateInBetweenDays automatically fills in all days between now and final day", () => {
  const today = DateTime.fromObject({ year: 2023, month: 11, day: 4 });
  vi.setSystemTime(today.toJSDate());
  const dayOne = new PlannedDay(
    {
      day: DateTime.fromObject({ year: 2023, month: 11, day: 7 }),
      events: [],
    },
    [],
  );

  const dayTwo = new PlannedDay(
    {
      day: DateTime.fromObject({ year: 2023, month: 11, day: 11 }),
      events: [],
    },
    [],
  );

  const days = generateInBetweenDays([dayOne, dayTwo]);

  expect(days).toHaveLength(8);

  expect(
    days[0].rawDay.day.startOf("day").equals(
      DateTime.fromObject({
        year: 2023,
        month: 11,
        day: 4,
      }).startOf("day"),
    ),
  ).toEqual(true);

  expect(
    days[3].rawDay.day.startOf("day").equals(
      DateTime.fromObject({
        year: 2023,
        month: 11,
        day: 7,
      }).startOf("day"),
    ),
  ).toEqual(true);
});
