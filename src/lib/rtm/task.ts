import { DateTime } from "luxon";
import { RtmTask } from "rtm-js";

const priorityMapping = {
  1: "High",
  2: "Medium",
  3: "Low",
} as const;

export type TaskPriority =
  (typeof priorityMapping)[keyof typeof priorityMapping];

export interface TaskParams {
  id: string;
  due?: DateTime;
  added?: DateTime;
  completed?: DateTime;
  deleted?: DateTime;
  estimate?: string;
  postponed: number;
  priority?: TaskPriority;
}

export class Task {
  constructor(private rawTask: RtmTask | TaskParams) {}

  public get id(): string {
    return this.rawTask.id;
  }

  public get due(): DateTime | undefined {
    if (!this.rawTask.due) {
      return undefined;
    }

    return DateTime.isDateTime(this.rawTask.due)
      ? this.rawTask.due
      : DateTime.fromISO(this.rawTask.due);
  }

  public get added(): DateTime | undefined {
    if (!this.rawTask.added) {
      return undefined;
    }
    return DateTime.isDateTime(this.rawTask.added)
      ? this.rawTask.added
      : DateTime.fromISO(this.rawTask.added);
  }

  public get completed(): DateTime | undefined {
    if (!this.rawTask.completed) {
      return undefined;
    }
    return DateTime.isDateTime(this.rawTask.completed)
      ? this.rawTask.completed
      : DateTime.fromISO(this.rawTask.completed);
  }

  public get deleted(): DateTime | undefined {
    if (!this.rawTask.deleted) {
      return undefined;
    }
    return DateTime.isDateTime(this.rawTask.deleted)
      ? this.rawTask.deleted
      : DateTime.fromISO(this.rawTask.deleted);
  }

  public get estimate(): string | undefined {
    if (!this.rawTask.estimate) {
      return undefined;
    }
    return this.rawTask.estimate;
  }

  public get postponed(): number {
    return Number(this.rawTask.postponed);
  }

  public get priority(): TaskPriority | undefined {
    const priority = this.rawTask.priority;
    if (!priority) {
      return undefined;
    }

    const priorityAsNumber = Number(priority);
    if (Number.isNaN(priorityAsNumber)) {
      return priority as TaskPriority;
    }

    const mapping = priorityMapping[Number(this.rawTask.priority) as 1 | 2 | 3];

    return mapping;
  }
}
