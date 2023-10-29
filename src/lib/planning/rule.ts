import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

interface RuleSuccess<N extends string> {
  result: "success";
  name: N;
}

interface RuleFailed<N extends string> {
  result: "failed";
  message: string;
  name: N;
}

type RuleResult<N extends string> = RuleSuccess<N> | RuleFailed<N>;

export interface PlanningRule<N extends string> {
  name: N;
  canScheduleTask: (day: PlannedDay, proposedTask: Task) => RuleResult<N>;
}
