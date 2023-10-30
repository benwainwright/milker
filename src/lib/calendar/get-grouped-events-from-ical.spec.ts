import { describe, it, expect, vi, beforeEach } from "vitest";
import Downloader from "nodejs-file-downloader";
import ical from "ical";
import { groupIcalEvents } from "./group-ical-events";
import { getGroupedEventsFromIcal } from "./get-grouped-events-from-ical";
import { mock } from "vitest-mock-extended";
import { Day } from "../../types/day";

vi.mock("nodejs-file-downloader");
vi.mock("ical");
vi.mock("./group-ical-events");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getGroupedEventsFromIcal", () => {
  it("should download the ical file and return grouped events", async () => {
    const icalFileUrl = "http://example.com/calendar.ics";
    const mockDownload = vi.fn().mockResolvedValue(undefined);

    const mockDownloader = mock<Downloader>({
      download: mockDownload,
    });

    vi.mocked(Downloader).mockImplementation(() => mockDownloader);

    const mockedIcalData: { [key: string]: ical.CalendarComponent } = {};
    vi.mocked(ical.parseFile).mockReturnValue(mockedIcalData);

    const mockedDays: Day[] = [];
    vi.mocked(groupIcalEvents).mockReturnValue(mockedDays);

    const mockCwd = "/mocked/path";
    vi.spyOn(process, "cwd").mockReturnValue(mockCwd);

    const result = await getGroupedEventsFromIcal(icalFileUrl);

    const expectedDirectory = `${mockCwd}/milk`;

    expect(Downloader).toHaveBeenCalledWith({
      fileName: "temp.ics",
      directory: expectedDirectory,
      skipExistingFileName: true,
      url: icalFileUrl,
    });

    expect(mockDownload).toHaveBeenCalled();
    expect(ical.parseFile).toHaveBeenCalledWith(
      `${expectedDirectory}/temp.ics`,
    );
    expect(groupIcalEvents).toHaveBeenCalledWith(mockedIcalData);
    expect(result).toBe(mockedDays);
  });
});
