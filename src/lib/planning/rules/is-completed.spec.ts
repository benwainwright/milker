import { describe, it, expect } from "vitest";
import { isCompleted } from "./is-completed";
import { mock } from "vitest-mock-extended";
import { DateTime } from "luxon";
import { ITask } from "../../../types/ITask";

describe("isCompleted PlanningRule", () => {
  it("should allow scheduling if the proposed task is not completed", () => {
    const proposedTask = mock<ITask>({ completed: undefined });
    const result = isCompleted.canScheduleTask(mock(), proposedTask);

    expect(result).toEqual({
      result: "success",
      name: isCompleted.name,
    });
  });

  it("should prevent scheduling if the proposed task is completed", () => {
    const proposedTask = mock<ITask>({ completed: DateTime.now() });
    const result = isCompleted.canScheduleTask(mock(), proposedTask);

    expect(result).toEqual({
      name: isCompleted.name,
      result: "failed",
      stopProcessing: true,
      message: "task not scheduled as it was completed",
    });
  });
});
