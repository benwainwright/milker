import { DateTime } from "luxon";
import { Task } from "../rtm/task";
import { PlannedDay } from "./planned-day";

interface PlanningResult {
  unscheduledTasks: Task[];
}

export class PlanningEngine {
  private rawDays: PlannedDay[];
  private generatedDays: PlannedDay[] | undefined;

  public constructor(initialDays: PlannedDay[]) {
    this.rawDays = initialDays;
  }

  private static generateInBetweenDays(rawDays: PlannedDay[]) {
    const today = DateTime.now().startOf("day");

    const todayWrapped = rawDays[0].newWithRules({
      day: DateTime.now().startOf("day"),
      events: [],
    });

    const daysIncludingToday =
      rawDays[0].rawDay.day.startOf("day") === today
        ? rawDays
        : [todayWrapped, ...rawDays];

    const everythingBeforeFinalDay = daysIncludingToday.flatMap(
      (day, index, array) => {
        if (index === array.length - 1) {
          return [];
        }
        const nextDay = array[index + 1];

        const extraDayCount =
          (nextDay.rawDay.day
            .startOf("day")
            .diff(day.rawDay.day.startOf("day"), ["days", "hours"])
            .toObject().days ?? 1) - 1;

        const extraDays = Array.from({ length: extraDayCount }).map(
          (_, index) =>
            day.newWithRules({
              events: [],
              day: DateTime.fromMillis(day.rawDay.day.toMillis()).plus({
                days: index + 1,
              }),
            }),
        );

        return [day, ...extraDays];
      },
    );

    return [...everythingBeforeFinalDay, rawDays[rawDays.length - 1]];
  }

  public get days(): PlannedDay[] {
    if (!this.generatedDays) {
      this.generatedDays = PlanningEngine.generateInBetweenDays(this.rawDays);
    }

    return this.generatedDays;
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

  public static makeTasklistReducerForDay(day: PlannedDay) {
    return (remainingTasks: Task[], currentTask: Task) => {
      if (day.tryToScheduleTask(currentTask)) {
        return remainingTasks;
      }
      return [...remainingTasks, currentTask];
    };
  }
}
