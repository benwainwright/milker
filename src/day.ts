import { CalendarComponent } from "ical";
import { DateTime } from "luxon";

export interface Day {
  day: DateTime;
  events: CalendarComponent;
}
