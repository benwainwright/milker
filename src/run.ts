import "dotenv/config";
import { RtmClient } from "./lib/rtm/client";
import { TerminalTokenRequester } from "./lib/rtm/terminal-token-requester";
import { getEnv } from "./lib/core/get-env";
import { FlatFileJsonStorage } from "./lib/rtm/flat-file-json-storage";
import { getGroupedEventsFromIcal } from "./lib/calendar/get-grouped-events-from-ical";
import { PlanningEngine } from "./lib/planning/planning-engine";
import { PlannedDay } from "./lib/planning/planned-day";
import { initialisePlanningRules } from "./lib/core/initialise-rules";

const run = async () => {
  console.log("Downloading ical");
  const ical = getEnv("SOURCE_ICAL");
  const days = await getGroupedEventsFromIcal(ical);

  console.log("Getting tasks from RTM");
  const storage = new FlatFileJsonStorage(`${process.cwd()}/token.json`);
  const tokenRequester = new TerminalTokenRequester();
  const key = getEnv("MILK_API_KEY");
  const secret = getEnv("MILK_SHARED_SECRET");

  const client = new RtmClient(storage, tokenRequester, key, secret, "delete");

  const tasks = await client.getAllTasks();

  console.log("initialising Planning Engine");
  const rules = initialisePlanningRules();

  const engine = new PlanningEngine(
    days.map((day) => new PlannedDay(day, rules)),
  );

  console.log("Reallocating tasks");

  const result = engine.allocateTasks(
    tasks.flatMap((task) => {
      return task.tasks;
    }),
  );

  console.log({ days: days.length });

  console.log(
    engine.days.map((day) =>
      day.scheduledTasks.map((task) => task.parent.name),
    ),
  );
};

run().catch((error) => console.log(error));
