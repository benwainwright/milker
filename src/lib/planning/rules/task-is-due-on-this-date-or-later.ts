import { PlanningRule } from "../rule";

const name = "task-is-due-on-this-date-or-later";

export const taskIsDueOnThisDateOrLater: PlanningRule<"task-is-due-on-this-date-or-later"> =
  {
    name,
    canScheduleTask: (day, proposedTask) => {
      if (!proposedTask.due) {
        return {
          name,
          result: "failed",
          stopProcessing: false,
          message: "due was undefined",
        };
      }

      const result =
        proposedTask.due.startOf("day") >= day.rawDay.day.startOf("day");

      if (result) {
        return {
          result: "success",
          name,
        };
      }

      return {
        name,
        result: "failed",
        stopProcessing: true,
        message: "Tasks due date was in the past",
      };
    },
  };
