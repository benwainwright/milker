import { PlannedDay } from "./planned-day";
import { PlanningEngine } from "./planning-engine";
import { vi } from "vitest";
import { DateTime } from "luxon";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("Planning engine automatically fills in all days between now and final day", () => {
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

  const engine = new PlanningEngine([dayOne, dayTwo]);

  expect(engine.days).toHaveLength(8);

  expect(
    engine.days[0].rawDay.day.startOf("day").equals(
      DateTime.fromObject({
        year: 2023,
        month: 11,
        day: 4,
      }).startOf("day"),
    ),
  ).toEqual(true);

  expect(
    engine.days[3].rawDay.day.startOf("day").equals(
      DateTime.fromObject({
        year: 2023,
        month: 11,
        day: 7,
      }).startOf("day"),
    ),
  ).toEqual(true);
});
