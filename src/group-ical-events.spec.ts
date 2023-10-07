import { groupIcalEvents } from "./group-ical-events";
import ical from "ical";
import { DateTime } from "luxon";
import path from "path";

const FIXTURES_DIR = path.join(__dirname, "..", "fixtures");

describe("group ical events", () => {
  it("Creates the right number of groups", () => {
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result).toHaveLength(2);
  });

  it("Creates the right date buckets", () => {
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result[0].day).toEqual(DateTime.fromISO("2023-10-09"));
    expect(result[1].day).toEqual(DateTime.fromISO("2023-10-10"));
  });

  it("Puts the right events in the right buckets", () => {
    const parsed = ical.parseFile(
      path.join(FIXTURES_DIR, "simple-calendar.ics"),
    );

    const result = groupIcalEvents(parsed);
    expect(result[0].events[0].summary).toEqual("TestEvent1");
    expect(result[0].events[1].summary).toEqual("TestEvent2");
    expect(result[1].events[0].summary).toEqual("Event3");
  });
});
