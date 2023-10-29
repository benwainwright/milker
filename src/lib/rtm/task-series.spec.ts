import { mock } from "vitest-mock-extended";
import { DateTime } from "luxon";
import { RtmTask, RtmTaskSeries } from "rtm-js";
import { TaskSeries, TaskSeriesParams } from "./task-series";
import { vi } from "vitest";
import { Task } from "./task";
import { when } from "jest-when";

vi.mock("./task");

beforeEach(() => {
  vi.resetAllMocks();
});

// TODO make the tests consistent with the non-optional nature of some of these props
test.each`
  oldKey           | newKey           | rawValue                  | value
  ${"id"}          | ${"id"}          | ${`1`}                    | ${"1"}
  ${"created"}     | ${"created"}     | ${`2012-02-12T16:45:35Z`} | ${DateTime.fromISO("2012-02-12T16:45:35Z")}
  ${"name"}        | ${"name"}        | ${`foo`}                  | ${"foo"}
  ${"source"}      | ${"source"}      | ${`js`}                   | ${"js"}
  ${"location_id"} | ${"location_id"} | ${`1234`}                 | ${"1234"}
  ${"location_id"} | ${"location_id"} | ${undefined}              | ${undefined}
  ${"location_id"} | ${"location_id"} | ${""}                     | ${undefined}
`(
  "maps $oldKey from rawdata with raw value $rawValue to key $newKey value $value",
  ({ oldKey, newKey, rawValue, value }) => {
    const rawTask = mock<RtmTaskSeries>({
      [oldKey]: rawValue,
    });
    const task = new TaskSeries(rawTask);
    const property = (task as { [key: string]: unknown } & TaskSeries)[newKey];
    expect(property).toStrictEqual(value);
  },
);

test.each`
  key              | value
  ${"id"}          | ${"1"}
  ${"created"}     | ${DateTime.fromISO("2012-02-12T16:45:35Z")}
  ${"name"}        | ${"foo"}
  ${"source"}      | ${"js"}
  ${"location_id"} | ${"1234"}
  ${"location_id"} | ${undefined}
  ${"location_id"} | ${undefined}
`(
  "correctly populates processed data and exposes it under key $newKey",
  ({ key, value }) => {
    const rawTask = mock<TaskSeriesParams>({
      id: "1",
      [key]: value,
    });
    const task = new TaskSeries(rawTask);
    const property = (task as { [key: string]: unknown } & TaskSeries)[key];
    expect(task.id).toEqual("1");
    expect(property).toStrictEqual(value);
  },
);

test("processess individual tasks with the task constructor", () => {
  const mockRawTaskOne = mock<RtmTask>();
  const mockRawTaskTwo = mock<RtmTask>();
  const mockRawTaskThree = mock<RtmTask>();
  const mockRawTaskFour = mock<RtmTask>();
  const mockRawTaskFive = mock<RtmTask>();

  const mockTaskOne = mock<Task>();
  const mockTaskTwo = mock<Task>();
  const mockTaskThree = mock<Task>();
  const mockTaskFour = mock<Task>();
  const mockTaskFive = mock<Task>();

  when(vi.mocked(Task))
    .calledWith(mockRawTaskOne)
    .mockReturnValue(mock(mockTaskOne));
  when(vi.mocked(Task))
    .calledWith(mockRawTaskTwo)
    .mockReturnValue(mock(mockTaskTwo));
  when(vi.mocked(Task))
    .calledWith(mockRawTaskThree)
    .mockReturnValue(mock(mockTaskThree));
  when(vi.mocked(Task))
    .calledWith(mockRawTaskFour)
    .mockReturnValue(mock(mockTaskFour));
  when(vi.mocked(Task))
    .calledWith(mockRawTaskFive)
    .mockReturnValue(mock(mockTaskFive));

  const mockTaskSeries = mock<RtmTaskSeries>({
    id: "1",
    task: [
      mockRawTaskOne,
      mockRawTaskTwo,
      mockRawTaskThree,
      mockRawTaskFour,
      mockRawTaskFive,
    ],
  });

  const taskSeries = new TaskSeries(mockTaskSeries);

  expect(taskSeries.tasks).toEqual([
    mockTaskOne,
    mockTaskTwo,
    mockTaskThree,
    mockTaskFour,
    mockTaskFive,
  ]);
});

test("supplies the actual tasks if data is was not raw", () => {
  const mockTaskOne = mock<Task>();
  const mockTaskTwo = mock<Task>();
  const mockTaskThree = mock<Task>();
  const mockTaskFour = mock<Task>();
  const mockTaskFive = mock<Task>();

  const taskSeries = new TaskSeries({
    id: "1",
    created: DateTime.fromISO("2018-07-25T13:47:24Z"),
    name: "foo",
    source: "js",
    tasks: [
      mockTaskOne,
      mockTaskTwo,
      mockTaskThree,
      mockTaskFour,
      mockTaskFive,
    ],
  });

  expect(taskSeries.tasks).toEqual([
    mockTaskOne,
    mockTaskTwo,
    mockTaskThree,
    mockTaskFour,
    mockTaskFive,
  ]);
});
