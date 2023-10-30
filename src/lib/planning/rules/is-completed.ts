const name = "is-completed";

import { PlanningRule } from "../rule";

export const isCompleted: PlanningRule<"is-completed"> = {
  name,
  canScheduleTask: (_day, proposedTask) => {
    const result = !proposedTask.completed;

    if (result) {
      return {
        result: "success",
        name,
      };
    }

    return {
      name,
      result: "failed",
      stopProcessing: true,
      message: "task not scheduled as it was completed",
    };
  },
};
