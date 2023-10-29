import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

interface PlanningResult {
  unscheduledTasks: Task[];
}

export class PlanningEngine {
  public constructor(public readonly days: PlannedDay[]) {}

  public allocateTasks(tasks: Task[]): PlanningResult {
    console.log("ONE");
    const sortedTasks = tasks.slice().toSorted((a, b) => {
      if (!a.due || !b.due) {
        return 0;
      }
      return a.due > b.due ? 1 : -1;
    });

    console.log("TWO");

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
