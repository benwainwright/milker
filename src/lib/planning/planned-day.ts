import { PlanningRule } from "./rule";
import { Task } from "../rtm/task";
import { Day } from "../../types/day";

const WORK_STRING = "Work";

type DayType =
  | "WorkDayWithFreeEvening"
  | "WorkdayWithEveningPlans"
  | "FreeWeekendDay"
  | "BusyWeekendDay";

export class PlannedDay {
  private currentlyScheduledTasks: Task[] = [];
  constructor(
    public readonly rawDay: Day,
    private rules: PlanningRule<string>[],
  ) {}

  public isAfter(other: PlannedDay): boolean {
    return this.rawDay.day > other.rawDay.day;
  }

  public get isWorkday(): boolean {
    return this.rawDay.events.some((day) => day.summary?.includes(WORK_STRING));
  }

  public tryToScheduleTask(task: Task): boolean {
    const ruleFailureFound = this.rules.some((rule) => {
      const { result } = rule.canScheduleTask(this, task);
      return result === "failed";
    });

    if (!ruleFailureFound) {
      this.currentlyScheduledTasks.push(task);
      return true;
    }
    return false;
  }

  public get scheduledTasks(): Task[] {
    return this.currentlyScheduledTasks;
  }
}
