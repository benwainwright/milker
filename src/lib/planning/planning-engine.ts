import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

interface PlanningResult {
  unscheduledTasks: Task[];
}

export class PlanningEngine {
  public constructor(public readonly days: PlannedDay[]) {}

  public allocateTasks(tasks: Task[]): PlanningResult {
    const sortedTasks = tasks.slice().toSorted((a, b) => {
      if (!a.due || !b.due) {
        return 0;
      }
      return a.due.startOf("day") > b.due.startOf("day") ? 1 : -1;
    });

    const unscheduledTasks = this.days.reduce<Task[]>(
      (unscheduledTasks, day) => {
        return unscheduledTasks.reduce<Task[]>(
          (remainingTasks, currentTask) => {
            if (day.tryToScheduleTask(currentTask)) {
              return remainingTasks;
            }
            return [...remainingTasks, currentTask];
          },
          [],
        );
      },
      sortedTasks,
    );

    return { unscheduledTasks };
  }
}
