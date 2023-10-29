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
  constructor(private data: RtmTask | TaskParams) {}

  public get id(): string {
    return this.data.id;
  }

  public get due(): DateTime | undefined {
    if (!this.data.due) {
      return undefined;
    }

    return DateTime.isDateTime(this.data.due)
      ? this.data.due
      : DateTime.fromISO(this.data.due);
  }

  public get added(): DateTime | undefined {
    if (!this.data.added) {
      return undefined;
    }
    return DateTime.isDateTime(this.data.added)
      ? this.data.added
      : DateTime.fromISO(this.data.added);
  }

  public get completed(): DateTime | undefined {
    if (!this.data.completed) {
      return undefined;
    }
    return DateTime.isDateTime(this.data.completed)
      ? this.data.completed
      : DateTime.fromISO(this.data.completed);
  }

  public get deleted(): DateTime | undefined {
    if (!this.data.deleted) {
      return undefined;
    }
    return DateTime.isDateTime(this.data.deleted)
      ? this.data.deleted
      : DateTime.fromISO(this.data.deleted);
  }

  public get estimate(): string | undefined {
    if (!this.data.estimate) {
      return undefined;
    }
    return this.data.estimate;
  }

  public get postponed(): number {
    return Number(this.data.postponed);
  }

  public get priority(): TaskPriority | undefined {
    const priority = this.data.priority;
    if (!priority) {
      return undefined;
    }

    const priorityAsNumber = Number(priority);
    if (Number.isNaN(priorityAsNumber)) {
      return priority as TaskPriority;
    }

    const mapping = priorityMapping[Number(this.data.priority) as 1 | 2 | 3];

    return mapping;
  }
}
