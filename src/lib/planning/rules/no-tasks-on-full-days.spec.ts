import { describe, it, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { IPlannedDay } from "../../../types/IPlannedDay";
import { ITask } from "../../../types/ITask";
import { noTasksOnFullDay } from "./no-tasks-on-full-days";

describe("noTasksOnFullDay PlanningRule", () => {
  it("should prevent scheduling a task on a full day", () => {
    const mockDay = mock<IPlannedDay>({
      dayType: "FullDay",
    });

    const mockTask = mock<ITask>();

    const result = noTasksOnFullDay.canScheduleTask(mockDay, mockTask);

    expect(result).toEqual({
      name: noTasksOnFullDay.name,
      result: "failed",
      stopProcessing: false,
      message: expect.stringContaining("cannot be scheduled on a full day"),
    });
  });

  it("should allow scheduling a task on a non-full day", () => {
    const mockDay = mock<IPlannedDay>({
      dayType: "FreeDay",
    });

    const mockTask = mock<ITask>();

    const result = noTasksOnFullDay.canScheduleTask(mockDay, mockTask);

    expect(result).toEqual({
      result: "success",
      name: noTasksOnFullDay.name,
    });
  });
});
