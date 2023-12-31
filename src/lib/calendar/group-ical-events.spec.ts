import ical from "ical";
import { DateTime } from "luxon";
import path from "path";
import { groupIcalEvents } from "./group-ical-events";
import { vi } from "vitest";

const FIXTURES_DIR = path.join(__dirname, "..", "..", "..", "fixtures");

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("group ical events", () => {
  it("Creates the right number of groups", () => {
    const today = DateTime.fromObject({ year: 2023, month: 9, day: 4 });
    vi.setSystemTime(today.toJSDate());
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result).toHaveLength(2);
  });

  it("Creates the right date buckets", () => {
    const today = DateTime.fromObject({ year: 2023, month: 9, day: 4 });
    vi.setSystemTime(today.toJSDate());
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result[0].day).toEqual(DateTime.fromISO("2023-10-09"));
    expect(result[1].day).toEqual(DateTime.fromISO("2023-10-10"));
  });

  it("Puts the right events in the right buckets", () => {
    const today = DateTime.fromObject({ year: 2023, month: 9, day: 4 });
    vi.setSystemTime(today.toJSDate());
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result[0].events[0].summary).toEqual("TestEvent1");
    expect(result[0].events[1].summary).toEqual("TestEvent2");
    expect(result[1].events[0].summary).toEqual("Event3");
  });

  it("filters out events from the past", () => {
    const today = DateTime.fromObject({ year: 2023, month: 10, day: 30 });
    vi.setSystemTime(today.toJSDate());
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result).toHaveLength(0);
  });
});
