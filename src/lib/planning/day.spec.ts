import { DateTime } from "luxon";
import { Day } from "./day";
import { mock } from "vitest-mock-extended";
import { CalendarComponent } from "ical";
import { PlanningRule } from "./rule";
import { Task } from "../lib/rtm/task";
import { when } from "jest-when";
import { vi } from "vitest";

test("day.tryToScheduleTask returns true and stores task if none of the rules fail", () => {});

test("when scheduledTask list is empty and a schedule attempt is made, day.scheduledTasks returns false and list has task added to it if none of the rules fail", () => {
  const theDate = DateTime.fromISO("2009-11-01T12:36:47Z");

  const eventOne = mock<CalendarComponent>();
  const eventTwo = mock<CalendarComponent>();
  const eventThree = mock<CalendarComponent>();

  const proposedTask = mock<Task>();

  const ruleOne: PlanningRule = {
    canScheduleTask: vi.fn(),
  };

  const ruleTwo: PlanningRule = {
    canScheduleTask: vi.fn(),
  };

  const events = [eventOne, eventTwo, eventThree];

  when(ruleOne.canScheduleTask)
    .calledWith(theDate, events, [], proposedTask)
    .mockReturnValue(true);
  when(ruleTwo.canScheduleTask)
    .calledWith(theDate, events, [], proposedTask)
    .mockReturnValue(true);

  const day = new Day(theDate, events, [ruleOne, ruleTwo]);

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

  const ruleOne: PlanningRule = {
    canScheduleTask: vi.fn(),
  };

  const ruleTwo: PlanningRule = {
    canScheduleTask: vi.fn(),
  };

  const events = [eventOne, eventTwo, eventThree];

  when(ruleOne.canScheduleTask)
    .calledWith(theDate, events, [], proposedTask)
    .mockReturnValue(true);

  when(ruleTwo.canScheduleTask)
    .calledWith(theDate, events, [], proposedTask)
    .mockReturnValue(false);

  const day = new Day(theDate, events, [ruleOne, ruleTwo]);

  const result = day.tryToScheduleTask(proposedTask);
  expect(result).toEqual(false);
  expect(day.scheduledTasks).toHaveLength(0);
});
