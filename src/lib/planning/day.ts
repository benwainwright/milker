import { CalendarComponent } from "ical";
import { DateTime } from "luxon";
import { PlanningRule } from "./rule";
import { Task } from "../lib/rtm/task";

export class Day {
  private currentlyScheduledTasks: Task[] = [];
  constructor(
    private day: DateTime,
    private events: CalendarComponent[],
    private rules: PlanningRule[],
  ) {}

  public tryToScheduleTask(task: Task): boolean {
    const ruleFailureFound = this.rules.some(
      (rule) =>
        !rule.canScheduleTask(
          this.day,
          this.events,
          this.currentlyScheduledTasks,
          task,
        ),
    );

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
