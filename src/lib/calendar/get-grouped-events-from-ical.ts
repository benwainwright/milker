import Downloader from "nodejs-file-downloader";
import ical from "ical";
import { cwd } from "process";
import { groupIcalEvents } from "./group-ical-events";

export const getGroupedEventsFromIcal = async (icalFile: string) => {
  const TEMP_FILENAME = `temp.ics`;
  const DIR = `${cwd()}/milk`;
  const FILEPATH = `${DIR}/${TEMP_FILENAME}`;

  const downloader = new Downloader({
    url: icalFile,
    fileName: TEMP_FILENAME,
    directory: DIR,
    skipExistingFileName: true,
  });
  await downloader.download();
  const parsed = ical.parseFile(FILEPATH);
  return groupIcalEvents(parsed);
};
