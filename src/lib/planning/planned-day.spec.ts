import { DateTime } from "luxon";
import { PlannedDay } from "./planned-day";
import { mock } from "vitest-mock-extended";
import { CalendarComponent } from "ical";
import { PlanningRule } from "./rule";
import { Task } from "../rtm/task";
import { when } from "jest-when";
import { vi } from "vitest";

test.todo("handle multiple entries that add up to qualifying period");

test("When there is an entry during the day, but nothing in the evening, mark as a BusydayWithFreeEvening", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  const workEvent = mock<CalendarComponent>({
    summary: "Work",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T17:00:00Z"),
  });

  const events = [workEvent];

  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("BusyDayWithFreeEvening");
});

test("When the work event is only four hours long it still counts", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  const workEvent = mock<CalendarComponent>({
    summary: "Work",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T13:00:00Z"),
  });

  const events = [workEvent];

  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("BusyDayWithFreeEvening");
});

test("When there is an event in the evening and the day mark as a full day", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  const workEvent = mock<CalendarComponent>({
    summary: "Work",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T13:00:00Z"),
  });

  const eveningEvent = mock<CalendarComponent>({
    summary: "Evening Event",
    start: new Date("2009-01-12T18:00:00Z"),
    end: new Date("2009-01-12T21:00:00Z"),
  });

  const events = [workEvent, eveningEvent];

  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("FullDay");
});

test("When there are no events mark as free day", () => {
  const theDate = DateTime.fromISO("2009-11-01T12:36:47Z");

  const events: CalendarComponent[] = [];

  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("FreeDay");
});

test("When there is only an evening event mark as free daytime", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  const eveningEvent = mock<CalendarComponent>({
    summary: "Evening Event",
    start: new Date("2009-01-12T18:00:00Z"),
    end: new Date("2009-01-12T21:00:00Z"),
  });

  const events = [eveningEvent];

  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("FreeDayWithBusyEvening");
});

test("when scheduledTask list is empty and a schedule attempt is made, day.scheduledTasks returns false and list has task added to it if none of the rules fail", () => {
  const theDate = DateTime.fromISO("2009-11-01T12:36:47Z");

  const eventOne = mock<CalendarComponent>();
  const eventTwo = mock<CalendarComponent>();
  const eventThree = mock<CalendarComponent>();

  const proposedTask = mock<Task>();

  const ruleOne: PlanningRule<"test"> = {
    name: "test",
    canScheduleTask: vi.fn(),
  };

  const ruleTwo: PlanningRule<"test-two"> = {
    name: "test-two",
    canScheduleTask: vi.fn(),
  };

  const events = [eventOne, eventTwo, eventThree];

  const day = new PlannedDay({ day: theDate, events }, [ruleOne, ruleTwo]);

  when(ruleOne.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "success", name: "test" });

  when(ruleTwo.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "success", name: "test-two" });

  const result = day.tryToScheduleTask(proposedTask);
  expect(result).toBeTruthy();
  expect(day.scheduledTasks).toHaveLength(1);
});

test("when scheduledTask list is empty and a schedule attempt is made, day.scheduledTasks returns false and list remains empty if any of the rules fail", () => {
  const theDate = DateTime.fromISO("2009-11-01T12:36:47Z");

  const eventOne = mock<CalendarComponent>();
  const eventTwo = mock<CalendarComponent>();
  const eventThree = mock<CalendarComponent>();

  const proposedTask = mock<Task>();

  const ruleOne: PlanningRule<"test"> = {
    name: "test",
    canScheduleTask: vi.fn(),
  };

  const ruleTwo: PlanningRule<"test-two"> = {
    name: "test-two",
    canScheduleTask: vi.fn(),
  };

  const events = [eventOne, eventTwo, eventThree];

  const day = new PlannedDay({ day: theDate, events }, [ruleOne, ruleTwo]);

  when(ruleOne.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "success", name: "test" });

  when(ruleTwo.canScheduleTask).calledWith(day, proposedTask).mockReturnValue({
    result: "failed",
    message: "Failed for reason",
    name: "test-two",
    stopProcessing: false,
  });

  const result = day.tryToScheduleTask(proposedTask);
  expect(day.scheduledTasks).toHaveLength(0);
  expect(result).toEqual(false);
});
