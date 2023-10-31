import { PlannedDay } from "./planned-day";
import { generateInBetweenDays } from "./generate-in-between-days";
import { ITask } from "../../types/ITask";

interface PlanningResult {
  unscheduledTasks: ITask[];
}

export class PlanningEngine {
  private rawDays: PlannedDay[];
  private generatedDays: PlannedDay[] | undefined;

  public constructor(initialDays: PlannedDay[]) {
    this.rawDays = initialDays;
  }

  public get days(): PlannedDay[] {
    if (!this.generatedDays) {
      this.generatedDays = generateInBetweenDays(this.rawDays);
    }

    return this.generatedDays;
  }

  public allocateTasks(tasks: ITask[]): PlanningResult {
    const sortedTasks = tasks.slice().toSorted((a, b) => {
      if (!a.due || !b.due) {
        return 0;
      }
      return a.due > b.due ? 1 : -1;
    });

    const unscheduledTasks = this.days.reduce<ITask[]>(
      (unscheduledTasks, day) => {
        return unscheduledTasks.reduce<ITask[]>(
          PlanningEngine.makeTasklistReducerForDay(day),
          [],
        );
      },
      sortedTasks,
    );

    return { unscheduledTasks };
  }

  private static makeTasklistReducerForDay(day: PlannedDay) {
    return (remainingTasks: ITask[], currentTask: ITask) => {
      if (day.tryToScheduleTask(currentTask)) {
        return remainingTasks;
      }
      return [...remainingTasks, currentTask];
    };
  }
}
