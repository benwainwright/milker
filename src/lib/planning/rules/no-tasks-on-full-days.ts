import { PlanningRule } from "../rule";

const name = "no-tasks-on-full-day";

export const noTasksOnFullDay: PlanningRule<"no-tasks-on-full-day"> = {
  name,
  canScheduleTask: (day) => {
    if (day.dayType !== "FullDay") {
      return {
        result: "success",
        name,
      };
    }

    return {
      name,
      result: "failed",
      stopProcessing: false,
      message: "This day is full, no tasks allowed",
    };
  },
};
