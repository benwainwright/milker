import { DateTime } from "luxon";
import { PlannedDay } from "./planned-day";
import { mock } from "vitest-mock-extended";
import { CalendarComponent } from "ical";
import { PlanningRule } from "./rule";
import { Task } from "../rtm/task";
import { when } from "jest-when";
import { vi } from "vitest";
import { ITask } from "../../types/ITask";
import { ITaskSeries } from "../../types/ITaskSeries";

test.todo("handle multiple entries that add up to qualifying period");

test("PlannedDay isAfter - should return true if the day is after the other day", () => {
  const baseDay = DateTime.fromObject({ year: 2023, month: 11, day: 5 });
  const dayOne = new PlannedDay(
    { day: baseDay.plus({ days: 1 }), events: [] },
    [],
  );
  const dayTwo = new PlannedDay({ day: baseDay, events: [] }, []);

  expect(dayOne.isAfter(dayTwo)).toBe(true);
});

test("PlannedDay isAfter - should return false if both days are the same", () => {
  const baseDay = DateTime.fromObject({ year: 2023, month: 11, day: 5 });
  const dayOne = new PlannedDay({ day: baseDay, events: [] }, []);
  const dayTwo = new PlannedDay({ day: baseDay, events: [] }, []);

  expect(dayOne.isAfter(dayTwo)).toBe(false);
});

test("PlannedDay isAfter - should return false if the day is before the other day", () => {
  const baseDay = DateTime.fromObject({ year: 2023, month: 11, day: 5 });
  const dayOne = new PlannedDay(
    { day: baseDay.minus({ days: 1 }), events: [] },
    [],
  );
  const dayTwo = new PlannedDay({ day: baseDay, events: [] }, []);

  expect(dayOne.isAfter(dayTwo)).toBe(false);
});

test("PlannedDay isAfter - should handle different times on the same day correctly", () => {
  const baseDay = DateTime.fromObject({ year: 2023, month: 11, day: 5 });
  const dayOne = new PlannedDay(
    { day: baseDay.set({ hour: 10 }), events: [] },
    [],
  );
  const dayTwo = new PlannedDay(
    { day: baseDay.set({ hour: 8 }), events: [] },
    [],
  );

  expect(dayOne.isAfter(dayTwo)).toBe(true);
});

test("When there is an entry during the day, but nothing in the evening, mark as a BusydayWithFreeEvening", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  // @ts-expect-error broken typing from ical package
  const workEvent = mock<CalendarComponent>({
    summary: "Work",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T17:00:00Z"),
  });

  const events = [workEvent];

  // @ts-expect-error broken typing from ical package
  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("BusyDayWithFreeEvening");
});

test("When the work event is only four hours long it still counts", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  // @ts-expect-error broken typing from ical package
  const workEvent = mock<CalendarComponent>({
    summary: "Work",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T13:00:00Z"),
  });

  const events = [workEvent];

  // @ts-expect-error broken typing from ical package
  const day = new PlannedDay({ day: theDate, events }, []);
  expect(day.dayType).toEqual("BusyDayWithFreeEvening");
});

test("When there is an event in the evening and the day mark as a full day", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  // @ts-expect-error broken typing from ical package
  const workEvent = mock<CalendarComponent>({
    summary: "Work",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T13:00:00Z"),
  });

  // @ts-expect-error broken typing from ical package
  const eveningEvent = mock<CalendarComponent>({
    summary: "Evening Event",
    start: new Date("2009-01-12T18:00:00Z"),
    end: new Date("2009-01-12T21:00:00Z"),
  });

  const events = [workEvent, eveningEvent];

  // @ts-expect-error broken typing from ical package
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

  // @ts-expect-error broken typing from ical package
  const eveningEvent = mock<CalendarComponent>({
    summary: "Evening Event",
    start: new Date("2009-01-12T18:00:00Z"),
    end: new Date("2009-01-12T21:00:00Z"),
  });

  const events = [eveningEvent];

  // @ts-expect-error broken typing from ical package
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

test("toTable returns the correct table representation of the day's schedule", () => {
  const theDate = DateTime.fromISO("2009-01-12T12:36:47Z");

  // @ts-expect-error broken typing from ical package
  const event1 = mock<CalendarComponent>({
    summary: "Meeting",
    start: new Date("2009-01-12T09:00:00Z"),
    end: new Date("2009-01-12T10:00:00Z"),
  });

  // @ts-expect-error broken typing from ical package
  const event2 = mock<CalendarComponent>({
    summary: "Lunch",
    start: new Date("2009-01-12T12:00:00Z"),
    end: new Date("2009-01-12T13:00:00Z"),
  });

  // @ts-expect-error broken typing from ical package
  const event3 = mock<CalendarComponent>({
    summary: "Another Meeting",
    start: new Date("2009-01-12T13:00:00Z"),
    end: new Date("2009-01-12T16:00:00Z"),
  });

  const events = [event1, event2, event3];

  const taskSeries1 = mock<ITaskSeries>({ name: "Task Series 1" });
  const taskSeries2 = mock<ITaskSeries>({ name: "Task Series 2" });

  const task1 = mock<ITask>({ parent: taskSeries1 });
  const task2 = mock<ITask>({ parent: taskSeries2 });

  // @ts-expect-error broken typing from ical package
  const day = new PlannedDay({ day: theDate, events }, []);
  day.scheduledTasks.push(task1, task2);

  const expectedTable = [
    ["Date", "12 January 2009"],
    ["Day Type", "BusyDayWithFreeEvening"],
    [
      "Events",
      "• Meeting (09:00 - 10:00)\n• Lunch (12:00 - 13:00)\n• Another Meeting (13:00 - 16:00)",
    ],
    ["Task Count", "2"],
    ["Tasks", "• Task Series 1\n• Task Series 2"],
  ];

  const tableOutput = day.toTable();

  expect(tableOutput).toEqual(expectedTable);
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
