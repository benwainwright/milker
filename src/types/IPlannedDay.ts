import { ITask } from "./ITask";
import { Day } from "./day";
import { DayType } from "./day-type";

export interface IPlannedDay {
  readonly rawDay: Day;
  readonly dayType: DayType;
  readonly toTable: () => string[][];
  readonly tryToScheduleTask: (task: ITask) => boolean;
  readonly scheduledTasks: ITask[];
}
