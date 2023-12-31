import { DateTime } from "luxon";
import { TaskPriority } from "./task-priority";
import { ITaskSeries } from "./ITaskSeries";

export interface ITask {
  readonly completed: DateTime | undefined;
  readonly id: string;
  readonly due: DateTime | undefined;
  readonly added: DateTime | undefined;
  readonly deleted: DateTime | undefined;
  readonly estimate: string | undefined;
  readonly postponed: number;
  readonly priority: TaskPriority | undefined;
  readonly parent: ITaskSeries;
}
