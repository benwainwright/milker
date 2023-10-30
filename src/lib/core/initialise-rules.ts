import { PlanningRule } from "../planning/rule";
import { isCompleted } from "../planning/rules/is-completed";
import { noTasksOnFullDay } from "../planning/rules/no-tasks-on-full-days";
import { taskIsDueOnThisDateOrLater } from "../planning/rules/task-is-due-on-this-date-or-later";

export const initialisePlanningRules = (): PlanningRule<string>[] => {
  return [isCompleted, taskIsDueOnThisDateOrLater, noTasksOnFullDay];
};
