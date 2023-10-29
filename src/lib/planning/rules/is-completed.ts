import { PlanningRule } from "../rule";

export const isCompleted: PlanningRule = {
  name: "is-completed",
  canScheduleTask: (day, proposedTask) => {
    return !Boolean(proposedTask.completed)
  }
}
