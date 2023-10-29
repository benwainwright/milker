import { PlanningRule } from "./rule";
import { Task } from "../rtm/task";
import { Day } from "../../types/day";

export class PlannedDay {
  private currentlyScheduledTasks: Task[] = [];
  constructor(
    public readonly rawDay: Day,
    private rules: PlanningRule[],
  ) {}

  public isAfter(other: PlannedDay): boolean {
    return this.rawDay.day > other.rawDay.day;
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
