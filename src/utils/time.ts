import moment from "moment";

export function transTime(value: string): string {
  const time = moment(value, moment.ISO_8601, true);
  if (time.isValid()) {
    return time.toString();
  }

  return value;
}

export function formatDateTime(string: string) {
  return moment(string).format("MMM DD, YYYY, HH:mm:ss");
}
