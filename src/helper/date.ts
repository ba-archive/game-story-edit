import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(
  date: string | number | Date,
  format = "YYYY-MM-DD HH:mm:ss"
) {
  return dayjs(date).format(format);
}

export function toShanghaiTime(date: Date) {
  return dayjs(date).tz("Asia/Shanghai").toDate();
}

export function getShanghaiDate() {
  return dayjs().tz("Asia/Shanghai").toDate();
}
