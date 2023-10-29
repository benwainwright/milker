import { PlanningRule } from "../rule";

const name = "is-completed";

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
      message: "task not scheduled as it was completed",
    };
  },
};
