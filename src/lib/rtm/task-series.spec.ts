import { TaskSeries } from "./task-series";
import { mock } from "vitest-mock-extended";

test("task-series constructor runs without errors when passed in a task series", () => {
  new TaskSeries(mock());
});
