import { vi } from "vitest";
import { PlanningEngine } from "./planning-engine";
import { mock } from "vitest-mock-extended";
import { Task } from "../rtm/task";
import { when } from "jest-when";
import { PlannedDay } from "./planned-day";
import { PlanningRule } from "./rule";
import { Day } from "../../types/day";
import { DateTime } from "luxon";

vi.mock("./task");

beforeEach(() => {
  vi.resetAllMocks();
});

test("allocate tasks continues to try scheduling unto all the tasks are exhausted, then returns a result indicating no tasks are unallocated", () => {
  // One
  const taskTwo = mock<Task>({
    id: "two",
    due: DateTime.fromISO("2011-01-02T00:00:00Z"),
  });

  const taskThree = mock<Task>({
    id: "three",
    due: DateTime.fromISO("2011-03-01T00:00:00Z"),
  });

  const taskSix = mock<Task>({
    id: "six",
    due: DateTime.fromISO("2011-04-04T00:00:00Z"),
  });

  const taskSeven = mock<Task>({
    id: "seven",
    due: DateTime.fromISO("2011-04-10T00:00:00Z"),
  });

  const taskOne = mock<Task>({
    id: "one",
    due: DateTime.fromISO("2011-09-11T19:16:55Z"),
  });

  const taskFive = mock<Task>({
    id: "five",
    due: DateTime.fromISO("2011-10-10T00:00:00Z"),
  });
  const taskFour = mock<Task>({
    id: "four",
    due: DateTime.fromISO("2011-12-09T00:00:00Z"),
  });

  const taskEight = mock<Task>({
    id: "eight",
    due: DateTime.fromISO("2012-04-19T00:00:00Z"),
  });

  const ruleOne = mock<PlanningRule>();

  const rules = [ruleOne];

  /*
   * Thank god for ChatGPT...
   */

  const mockDayOne = mock<Day>();
  const dayOne = new PlannedDay(mockDayOne, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskOne)
    .mockReturnValue(true);

  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskOne)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskTwo)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskThree)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskFour)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskFive)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskSeven)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayOne, taskEight)
    .mockReturnValue(false);

  const mockDayTwo = mock<Day>();
  const dayTwo = new PlannedDay(mockDayTwo, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskOne)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskTwo)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskThree)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskFour)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskFive)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskSeven)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayTwo, taskEight)
    .mockReturnValue(false);

  const mockDayThree = mock<Day>();
  const dayThree = new PlannedDay(mockDayThree, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskOne)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskTwo)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskThree)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskFour)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskFive)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskSeven)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayThree, taskEight)
    .mockReturnValue(false);

  const mockDayFour = mock<Day>();
  const dayFour = new PlannedDay(mockDayFour, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskOne)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskTwo)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskThree)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskFour)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskFive)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskSeven)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFour, taskEight)
    .mockReturnValue(false);

  const mockDayFive = mock<Day>();
  const dayFive = new PlannedDay(mockDayFive, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskOne)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskTwo)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskThree)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskFour)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskFive)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskSix)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskSeven)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayFive, taskEight)
    .mockReturnValue(false);

  const mockDaySix = mock<Day>();
  const daySix = new PlannedDay(mockDaySix, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskOne)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskTwo)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskThree)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskFour)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskFive)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskSeven)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySix, taskEight)
    .mockReturnValue(false);

  const mockDaySeven = mock<Day>();
  const daySeven = new PlannedDay(mockDaySeven, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskOne)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskTwo)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskThree)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskFour)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskFive)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskSeven)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(daySeven, taskEight)
    .mockReturnValue(false);

  const mockDayEight = mock<Day>();
  const dayEight = new PlannedDay(mockDayEight, rules);

  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskOne)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskTwo)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskThree)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskFour)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskFive)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskSix)
    .mockReturnValue(false);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskSeven)
    .mockReturnValue(true);
  when(ruleOne.canScheduleTask)
    .calledWith(dayEight, taskEight)
    .mockReturnValue(true);

  const days = [
    dayOne,
    dayTwo,
    dayThree,
    dayFour,
    dayFive,
    daySix,
    daySeven,
    dayEight,
  ];

  const engine = new PlanningEngine(days);

  engine.allocateTasks([
    taskOne,
    taskTwo,
    taskThree,
    taskFour,
    taskFive,
    taskSix,
    taskSeven,
    taskEight,
  ]);

  expect(engine.days[0]).toEqual(dayOne);
  expect(engine.days[1]).toEqual(dayTwo);
  expect(engine.days[2]).toEqual(dayThree);
  expect(engine.days[3]).toEqual(dayFour);
  expect(engine.days[4]).toEqual(dayFive);
  expect(engine.days[5]).toEqual(daySix);

  expect(engine.days[0].scheduledTasks).toEqual(
    expect.arrayContaining([taskThree, taskTwo, taskOne]),
  );
  expect(engine.days[1].scheduledTasks).toHaveLength(0);
  expect(engine.days[2].scheduledTasks).toHaveLength(0);
  expect(engine.days[3].scheduledTasks).toHaveLength(0);

  expect(engine.days[4].scheduledTasks).toEqual(
    expect.arrayContaining([taskSix]),
  );
  expect(engine.days[5].scheduledTasks).toEqual(
    expect.arrayContaining([taskFive]),
  );
  expect(engine.days[6].scheduledTasks).toEqual(
    expect.arrayContaining([taskSeven, taskFour]),
  );
  expect(engine.days[7].scheduledTasks).toEqual(
    expect.arrayContaining([taskEight]),
  );
});
