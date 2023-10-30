import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { DateTime } from "luxon";
import { Day } from "../../../types/day";
import { IPlannedDay } from "../../../types/IPlannedDay";
import { ITask } from "../../../types/ITask";
import { taskIsDueOnThisDateOrLater } from "./task-is-due-on-this-date-or-later";

describe("taskIsDueOnThisDateOrLater PlanningRule", () => {
  it("should prevent scheduling a task due later than this day", () => {
    const rawDay: Day = { day: DateTime.now(), events: [] };
    const mockDay = mock<IPlannedDay>({ rawDay });
    const mockTask = mock<ITask>({ due: rawDay.day.plus({ days: 1 }) });

    const result = taskIsDueOnThisDateOrLater.canScheduleTask(
      mockDay,
      mockTask,
    );

    expect(result).toEqual({
      name: taskIsDueOnThisDateOrLater.name,
      result: "failed",
      stopProcessing: false,
      message: expect.stringContaining(
        "task is due later than the attempted day",
      ),
    });
  });

  it("should allow scheduling a task due on or before this day", () => {
    const rawDay: Day = { day: DateTime.now(), events: [] };
    const mockDay = mock<IPlannedDay>({ rawDay });
    const mockTask = mock<ITask>({ due: rawDay.day });

    const result = taskIsDueOnThisDateOrLater.canScheduleTask(
      mockDay,
      mockTask,
    );

    expect(result).toEqual({
      result: "success",
      name: taskIsDueOnThisDateOrLater.name,
    });
  });

  it("should prevent scheduling a task with undefined due date", () => {
    const rawDay: Day = { day: DateTime.now(), events: [] };
    const mockDay = mock<IPlannedDay>({ rawDay });
    const mockTask = mock<ITask>({ due: undefined });

    const result = taskIsDueOnThisDateOrLater.canScheduleTask(
      mockDay,
      mockTask,
    );

    expect(result).toEqual({
      name: taskIsDueOnThisDateOrLater.name,
      result: "failed",
      stopProcessing: false,
      message: expect.stringContaining("task due date is undefined"),
    });
  });
});
