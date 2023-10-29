// import { cwd } from "process";

import "dotenv/config";
import { RtmClient } from "./lib/rtm/client";
import { TerminalTokenRequester } from "./lib/rtm/terminal-token-requester";
import { getEnv } from "./lib/core/get-env";
import { FlatFileJsonStorage } from "./lib/rtm/flat-file-json-storage";

// const BEN_ICAL =
//   "https://calendar.google.com/calendar/ical/e50f1bef70739f9f0a825126a7f8fed4f8a26d134060969f762330608667d647%40group.calendar.google.com/private-0fad6b4bf9797ac58d4e41f94aa1516c/basic.ics";

// const DIR = `${cwd()}/milk`;
// const TEMP_FILENAME = `temp.ics`;
// const FILEPATH = `${DIR}/${TEMP_FILENAME}`;

const run = async () => {
  // const downloader = new Downloader({
  //   url: getEnv('SOURCE_ICAL'),
  //   fileName: TEMP_FILENAME,
  //   directory: DIR,
  //   skipExistingFileName: true,
  // });
  // await downloader.download();
  // const parsed = ical.parseFile(FILEPATH);
  // // const current = Object.entries(parsed).filter(
  // //   ([, value]) =>
  // //     value.start && DateTime.fromJSDate(value.start) > DateTime.now(),
  // // );
  // await writeFile(`${cwd()}/data.json`, JSON.stringify(parsed));
  const storage = new FlatFileJsonStorage(`${process.cwd()}/token.json`);
  const tokenRequester = new TerminalTokenRequester();
  const key = getEnv("MILK_API_KEY");
  const secret = getEnv("MILK_SHARED_SECRET");
  const client = new RtmClient(storage, tokenRequester, key, secret, "delete");

  const tasks = await client.getAllTasks();
  console.log(tasks);
};

run().catch((error) => console.log(error));
