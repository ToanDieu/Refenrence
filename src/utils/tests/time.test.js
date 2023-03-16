import { formatDateTime } from "../time";

jest.mock("moment", () => {
  const moment = require.requireActual("moment-timezone");
  moment.tz.setDefault("UTC");
  return moment;
});

describe("formatDateTime", () => {
  it("should return the correct format", () => {
    expect(formatDateTime("2019-06-19T15:21:41Z")).toEqual(
      "Jun 19, 2019, 15:21:41"
    );
  });
});
