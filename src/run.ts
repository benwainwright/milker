import { writeFile } from "fs/promises";
import ical from "ical";
import { DateTime } from "luxon";

import Downloader from "nodejs-file-downloader";
import { cwd } from "process";
DateTime;

const BEN_ICAL =
  "https://calendar.google.com/calendar/ical/e50f1bef70739f9f0a825126a7f8fed4f8a26d134060969f762330608667d647%40group.calendar.google.com/private-0fad6b4bf9797ac58d4e41f94aa1516c/basic.ics";

const DIR = `${cwd()}/milk`;
const TEMP_FILENAME = `temp.ics`;
const FILEPATH = `${DIR}/${TEMP_FILENAME}`;

const run = async () => {
  const downloader = new Downloader({
    url: BEN_ICAL,
    fileName: TEMP_FILENAME,
    directory: DIR,
    skipExistingFileName: true,
  });

  console.log(FILEPATH);

  await downloader.download();

  const parsed = ical.parseFile(FILEPATH);

  // const current = Object.entries(parsed).filter(
  //   ([, value]) =>
  //     value.start && DateTime.fromJSDate(value.start) > DateTime.now(),
  // );

  await writeFile(`${cwd()}/data.json`, JSON.stringify(parsed));
};

run().catch((error) => console.log(error));
