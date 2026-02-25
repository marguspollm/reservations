import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import updateLocale from "dayjs/plugin/updateLocale";
import localeData from "dayjs/plugin/localeData";
import minMax from "dayjs/plugin/minMax";
import utc from "dayjs/plugin/utc";

import "dayjs/locale/en";
import "dayjs/locale/et";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.extend(minMax);
dayjs.extend(utc);

export default dayjs;
