import { DateTime } from "luxon";
import { RtmTaskSeries } from "rtm-js";
import { ITaskSeries } from "../../types/ITaskSeries";
import { ITask } from "../../types/ITask";
import { Task } from "./task";

export interface TaskSeriesParams {
  id: string;
  created: DateTime;
  name: string;
  source: string;
  locationId?: string;
  tasks: ITask[];
}

export class TaskSeries implements ITaskSeries {
  constructor(private data: RtmTaskSeries | TaskSeriesParams) {}

  public get id(): string {
    return this.data.id;
  }

  public get created(): DateTime {
    return DateTime.isDateTime(this.data.created)
      ? this.data.created
      : DateTime.fromISO(this.data.created);
  }

  public get name(): string {
    return this.data.name;
  }

  public get source(): string {
    return this.data.source;
  }

  public get locationId(): string | undefined {
    if ("location_id" in this.data) {
      if (!this.data.location_id) {
        return undefined;
      }
      return this.data.location_id;
    } else {
      if (!this.data.locationId) {
        return undefined;
      }
      return this.data.locationId;
    }
  }

  public get tasks(): ITask[] {
    const isRawTask = (data: typeof this.data): data is RtmTaskSeries => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!data) {
        return false;
      }
      return Object.prototype.hasOwnProperty.call(data, "task");
    };
    if (isRawTask(this.data)) {
      // TODO test to test parent linking
      return this.data.task?.map((task) => new Task(task, this)) ?? [];
    }
    return this.data.tasks;
  }
}
