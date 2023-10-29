import { mock } from "vitest-mock-extended";
import { TaskSeries } from "./task-series";

test("task-series constructor runs without errors when passed in a task series", () => {
  new TaskSeries(mock());
});
