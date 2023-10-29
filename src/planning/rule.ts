import { CalendarComponent } from "ical";
import { Task } from "../lib/rtm/task";
import { DateTime } from "luxon";

export interface PlanningRule {
  canScheduleTask: (
    day: DateTime,
    events: CalendarComponent[],
    currentTasks: Task[],
    proposedTask: Task,
  ) => boolean;
}
