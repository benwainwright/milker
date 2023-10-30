import { DateTime } from "luxon";
import { ITask } from "./ITask";

export interface ITaskSeries {
  readonly id: string;
  readonly created: DateTime;
  readonly name: string;
  readonly source: string;
  readonly locationId: string | undefined;
  readonly tasks: ITask[];
}
