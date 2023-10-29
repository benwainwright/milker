import { PlanningRule } from "../planning/rule";
import { isCompleted } from "../planning/rules/is-completed";

export const initialisePlanningRules = (): PlanningRule<string>[] => {
  return [isCompleted];
};
