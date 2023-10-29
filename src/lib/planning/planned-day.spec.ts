import { DateTime } from "luxon";
import { PlannedDay } from "./planned-day";
import { mock } from "vitest-mock-extended";
import { CalendarComponent } from "ical";
import { PlanningRule } from "./rule";
import { Task } from "../rtm/task";
import { when } from "jest-when";
import { vi } from "vitest";

test("when scheduledTask list is empty and a schedule attempt is made, day.scheduledTasks returns false and list has task added to it if none of the rules fail", () => {
  const theDate = DateTime.fromISO("2009-11-01T12:36:47Z");

  const eventOne = mock<CalendarComponent>();
  const eventTwo = mock<CalendarComponent>();
  const eventThree = mock<CalendarComponent>();

  const proposedTask = mock<Task>();

  const ruleOne: PlanningRule = {
    name: "test",
    canScheduleTask: vi.fn(),
  };

  const ruleTwo: PlanningRule = {
    name: "test",
    canScheduleTask: vi.fn(),
  };

  const events = [eventOne, eventTwo, eventThree];

  const day = new PlannedDay({ day: theDate, events }, [ruleOne, ruleTwo]);

  when(ruleOne.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "success" });

  when(ruleTwo.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "success" });

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
    name: "test",
    canScheduleTask: vi.fn(),
  };

  const ruleTwo: PlanningRule = {
    name: "test",
    canScheduleTask: vi.fn(),
  };

  const events = [eventOne, eventTwo, eventThree];

  const day = new PlannedDay({ day: theDate, events }, [ruleOne, ruleTwo]);

  when(ruleOne.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "success" });

  when(ruleTwo.canScheduleTask)
    .calledWith(day, proposedTask)
    .mockReturnValue({ result: "failed", message: "Failed for reason" });

  const result = day.tryToScheduleTask(proposedTask);
  expect(day.scheduledTasks).toHaveLength(0);
  expect(result).toEqual(false);
});
