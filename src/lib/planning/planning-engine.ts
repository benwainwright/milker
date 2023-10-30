import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

interface PlanningResult {
  unscheduledTasks: Task[];
}

export class PlanningEngine {
  public constructor(public readonly days: PlannedDay[]) {}

  public static makeTasklistReducerForDay(day: PlannedDay) {
    return (remainingTasks: Task[], currentTask: Task) => {
      if (day.tryToScheduleTask(currentTask)) {
        return remainingTasks;
      }
      return [...remainingTasks, currentTask];
    };
  }

  public allocateTasks(tasks: Task[]): PlanningResult {
    const sortedTasks = tasks.slice().toSorted((a, b) => {
      if (!a.due || !b.due) {
        return 0;
      }
      return a.due > b.due ? 1 : -1;
    });

    const unscheduledTasks = this.days.reduce<Task[]>(
      (unscheduledTasks, day) => {
        return unscheduledTasks.reduce<Task[]>(
          PlanningEngine.makeTasklistReducerForDay(day),
          [],
        );
      },
      sortedTasks,
    );

    return { unscheduledTasks };
  }
}
