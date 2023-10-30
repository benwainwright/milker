import { IPlannedDay } from "../../types/IPlannedDay";
import { ITask } from "../../types/ITask";

interface RuleSuccess<N extends string> {
  result: "success";
  name: N;
}

interface RuleFailed<N extends string> {
  result: "failed";
  stopProcessing: boolean;
  message: string;
  name: N;
}

type RuleResult<N extends string> = RuleSuccess<N> | RuleFailed<N>;

export interface PlanningRule<N extends string> {
  name: N;
  canScheduleTask: (day: IPlannedDay, proposedTask: ITask) => RuleResult<N>;
}
