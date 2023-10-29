import { mock } from "vitest-mock-extended";
import { Task, TaskParams } from "./task";
import { DateTime } from "luxon";
import { RtmTask } from "rtm-js";

test.each`
  oldKey         | newKey         | rawValue                  | value
  ${"id"}        | ${"id"}        | ${`1`}                    | ${"1"}
  ${"due"}       | ${"due"}       | ${`2012-02-12T16:45:35Z`} | ${DateTime.fromISO("2012-02-12T16:45:35Z")}
  ${"due"}       | ${"due"}       | ${``}                     | ${undefined}
  ${"due"}       | ${"due"}       | ${undefined}              | ${undefined}
  ${"added"}     | ${"added"}     | ${`2014-09-22T08:49:05Z`} | ${DateTime.fromISO("2014-09-22T08:49:05Z")}
  ${"added"}     | ${"added"}     | ${``}                     | ${undefined}
  ${"completed"} | ${"completed"} | ${`2014-09-22T08:49:05Z`} | ${DateTime.fromISO("2014-09-22T08:49:05Z")}
  ${"completed"} | ${"completed"} | ${``}                     | ${undefined}
  ${"completed"} | ${"completed"} | ${undefined}              | ${undefined}
  ${"deleted"}   | ${"deleted"}   | ${`2014-09-22T08:49:05Z`} | ${DateTime.fromISO("2014-09-22T08:49:05Z")}
  ${"deleted"}   | ${"deleted"}   | ${``}                     | ${undefined}
  ${"deleted"}   | ${"deleted"}   | ${undefined}              | ${undefined}
  ${"priority"}  | ${"priority"}  | ${`1`}                    | ${"High"}
  ${"priority"}  | ${"priority"}  | ${undefined}              | ${undefined}
  ${"priority"}  | ${"priority"}  | ${``}                     | ${undefined}
  ${"postponed"} | ${"postponed"} | ${`1`}                    | ${1}
  ${"estimate"}  | ${"estimate"}  | ${`1 hour`}               | ${"1 hour"}
  ${"estimate"}  | ${"estimate"}  | ${``}                     | ${undefined}
  ${"estimate"}  | ${"estimate"}  | ${undefined}              | ${undefined}
`(
  "maps $oldKey from rawdata with raw value $rawValue to key $newKey value $value",
  ({ oldKey, newKey, rawValue, value }) => {
    const rawTask = mock<RtmTask>({
      [oldKey]: rawValue,
    });
    const task = new Task(rawTask, mock());
    const property = (task as { [key: string]: unknown } & Task)[newKey];
    expect(property).toStrictEqual(value);
  },
);

test.each`
  key            | value
  ${"due"}       | ${DateTime.fromISO("2012-02-12T16:45:35Z")}
  ${"added"}     | ${DateTime.fromISO("2014-09-22T08:49:05Z")}
  ${"completed"} | ${DateTime.fromISO("2014-09-22T08:49:05Z")}
  ${"deleted"}   | ${DateTime.fromISO("2014-09-22T08:49:05Z")}
  ${"priority"}  | ${"High"}
  ${"postponed"} | ${1}
  ${"estimate"}  | ${"1 hour"}
`(
  "correctly populates processed data and exposes it under key $newKey",
  ({ key, value }) => {
    const rawTask = mock<TaskParams>({
      id: "1",
      [key]: value,
    });
    const task = new Task(rawTask, mock());
    const property = (task as { [key: string]: unknown } & Task)[key];
    expect(task.id).toEqual("1");
    expect(property).toBeDefined();
    expect(property).toStrictEqual(value);
  },
);
