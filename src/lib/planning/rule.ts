import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

export interface PlanningRule {
  canScheduleTask: (day: PlannedDay, proposedTask: Task) => boolean;
}
