import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

interface RuleSuccess {
  result: "success";
}

interface RuleFailed {
  result: "failed";
  message: string;
}

type RuleResult = RuleSuccess | RuleFailed;

export interface PlanningRule {
  name: string;
  canScheduleTask: (day: PlannedDay, proposedTask: Task) => RuleResult;
}
