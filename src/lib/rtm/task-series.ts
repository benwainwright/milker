import { DateTime } from "luxon";
import { RtmTaskSeries } from "rtm-js";
import { Task } from "./task";

export interface TaskSeriesParams {
  id: string;
  created: DateTime;
  name: string;
  source: string;
  location_id?: string;
  tasks: Task[];
}

export class TaskSeries {
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

  public get location_id(): string | undefined {
    if (!this.data.location_id) {
      return undefined;
    }
    return this.data.location_id;
  }

  public get tasks(): Task[] {
    const isRawTask = (data: typeof this.data): data is RtmTaskSeries => {
      if (!data) {
        return false;
      }
      return Object.prototype.hasOwnProperty.call(data, "task");
    };
    console.log({ data: this.data });
    if (isRawTask(this.data)) {
      // TODO test to test parent linking
      return this.data.task?.map((task) => new Task(task, this)) ?? [];
    }
    return this.data.tasks;
  }
}
