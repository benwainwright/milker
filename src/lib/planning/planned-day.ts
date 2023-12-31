import { PlanningRule } from "./rule";
import { Day } from "../../types/day";
import { DateTime } from "luxon";
import { CalendarComponent } from "ical";
import { DayType } from "../../types/day-type";
import { ITask } from "../../types/ITask";

const DAY_EVENT_QUALIFYING_LENGTH = 3;
const EVENING_EVENT_QUALIFYING_LENGTH = 2;

export class PlannedDay {
  private currentlyScheduledTasks: ITask[] = [];
  constructor(
    public readonly rawDay: Day,
    private rules: PlanningRule<string>[],
  ) {}

  public isAfter(other: PlannedDay): boolean {
    return this.rawDay.day > other.rawDay.day;
  }

  public newWithRules(rawDay: Day) {
    return new PlannedDay(rawDay, this.rules);
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
      ["Date", this.rawDay.day.toFormat("dd LLLL yyyy")],
      ["Day Type", this.dayType],
      [
        "Events",
        this.rawDay.events
          .map((event) => {
            if (!event.start || !event.end) {
              return [];
            }

            const start = DateTime.fromMillis(event.start.getTime()).toFormat(
              "T",
            );
            const end = DateTime.fromMillis(event.end.getTime()).toFormat("T");
            return `• ${event.summary} (${start} - ${end})`;
          })
          .join("\n"),
      ],
      ["Task Count", String(this.scheduledTasks.length)],
      [
        "Tasks",
        this.scheduledTasks.map((task) => `• ${task.parent.name}`).join("\n"),
      ],
    ];
  }

  public tryToScheduleTask(task: ITask): boolean {
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

  public get scheduledTasks(): ITask[] {
    return this.currentlyScheduledTasks;
  }
}
