import { PlanningRule } from "./rule";
import { Task } from "../rtm/task";
import { Day } from "../../types/day";
import { DateTime } from "luxon";
import { CalendarComponent } from "ical";

const DAY_EVENT_QUALIFYING_LENGTH = 3;
const EVENING_EVENT_QUALIFYING_LENGTH = 2;

type DayType =
  | "FullDay"
  | "BusyDayWithFreeEvening"
  | "FreeDay"
  | "FreeDayWithBusyEvening";

export class PlannedDay {
  private currentlyScheduledTasks: Task[] = [];
  constructor(
    public readonly rawDay: Day,
    private rules: PlanningRule<string>[],
  ) {}

  public isAfter(other: PlannedDay): boolean {
    return this.rawDay.day > other.rawDay.day;
  }

  private static eventQualifiesSpecificInterval(
    event: CalendarComponent,
    start: DateTime,
    end: DateTime,
    qualifyingLength: number,
  ): boolean {
    if (!event.start || !event.end) {
      return false;
    }
    const begin = DateTime.fromMillis(event.start.getTime());
    const finish = DateTime.fromMillis(event.end.getTime());

    const length = Math.abs(
      begin.diff(finish, ["hours", "minutes"]).toObject().hours ?? 0,
    );

    const afterStart = begin >= start;
    const beforeEnd = finish <= end;
    const longEnough = length >= qualifyingLength;

    return afterStart && beforeEnd && longEnough;
  }

  public get dayType(): DayType {
    const nineAmToday = DateTime.fromMillis(this.rawDay.day.toMillis())
      .startOf("day")
      .set({
        hour: 9,
        minute: 0,
        millisecond: 0,
      });

    const sixPmToday = DateTime.fromMillis(this.rawDay.day.toMillis())
      .startOf("day")
      .set({
        hour: 18,
        minute: 0,
        millisecond: 0,
      });

    const hasQualifyingDaytimeEvent = this.rawDay.events.some((event) =>
      PlannedDay.eventQualifiesSpecificInterval(
        event,
        nineAmToday,
        sixPmToday,
        DAY_EVENT_QUALIFYING_LENGTH,
      ),
    );

    const midnight = DateTime.fromMillis(this.rawDay.day.toMillis())
      .startOf("day")
      .set({
        hour: 23,
        minute: 59,
        millisecond: 59,
      });

    const hasQualifyingEveningEvent = this.rawDay.events.some((event) =>
      PlannedDay.eventQualifiesSpecificInterval(
        event,
        sixPmToday,
        midnight,
        EVENING_EVENT_QUALIFYING_LENGTH,
      ),
    );

    if (hasQualifyingDaytimeEvent && hasQualifyingEveningEvent) {
      return "FullDay";
    }

    if (hasQualifyingDaytimeEvent && !hasQualifyingEveningEvent) {
      return "BusyDayWithFreeEvening";
    }

    if (!hasQualifyingDaytimeEvent && hasQualifyingEveningEvent) {
      return "FreeDayWithBusyEvening";
    }

    return "FreeDay";
  }

  public toTable(): string[][] {
    return [
      ["Date", this.rawDay.day.toLocaleString()],
      ["Day Type", this.dayType],
      [
        "Events",
        this.rawDay.events
          .map((event) => {
            if (!event.start || !event.end) {
              return [];
            }

            const start = DateTime.fromJSDate(event.start).toLocaleString(
              DateTime.TIME_SIMPLE,
            );
            const end = DateTime.fromJSDate(event.end).toLocaleString(
              DateTime.TIME_SIMPLE,
            );
            return `- ${start} - ${end} (${event.summary})`;
          })
          .join("\n"),
      ],
      ["Tasks Count", String(this.scheduledTasks.length)],
      [
        "Tasks",
        this.scheduledTasks.map((task) => `- ${task.parent.name}`).join("\n"),
      ],
    ];
  }

  public tryToScheduleTask(task: Task): boolean {
    const ruleFailureFound = this.rules.some((rule) => {
      const { result } = rule.canScheduleTask(this, task);
      return result === "failed";
    });

    if (!ruleFailureFound) {
      this.currentlyScheduledTasks.push(task);
      return true;
    }
    return false;
  }

  public get scheduledTasks(): Task[] {
    return this.currentlyScheduledTasks;
  }
}
