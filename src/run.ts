import "dotenv/config";
import { RtmClient } from "./lib/rtm/client";
import { TerminalTokenRequester } from "./lib/rtm/terminal-token-requester";
import { getEnv } from "./lib/core/get-env";
import { FlatFileJsonStorage } from "./lib/rtm/flat-file-json-storage";
import { getGroupedEventsFromIcal } from "./lib/calendar/get-grouped-events-from-ical";
import { PlanningEngine } from "./lib/planning/planning-engine";
import { PlannedDay } from "./lib/planning/planned-day";

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

  console.log("Reallocating tasks");
  const engine = new PlanningEngine(days.map((day) => new PlannedDay(day, [])));

  engine.allocateTasks(tasks.flatMap((task) => task.tasks));
};

run().catch((error) => console.log(error));
