import { Card, CardHeader, CardContent, Alert } from "@mui/material";
import type { DayOfWeek } from "../../models/types/DayOfWeek";
import type { FacilitySchedule } from "../../models/entities/FacilitySchedule";
import OpeningHours from "./OpeningHours";
import { useTranslation } from "react-i18next";
import type { FacilityFormError } from "../../models/FormErrors";

type OpeningHoursFormProps = {
  schedules: FacilitySchedule[];
  toggleDay: (day: DayOfWeek) => void;
  updateTime: (
    day: DayOfWeek,
    field: "openTime" | "closeTime",
    value: string,
  ) => void;
  errors?: FacilityFormError;
};

function OpeningHoursForm({
  schedules,
  toggleDay,
  updateTime,
  errors,
}: OpeningHoursFormProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t("opening-hours.header")} />
      <CardContent>
        {errors?.schedules && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.schedules}
          </Alert>
        )}
        <OpeningHours
          schedules={schedules}
          toggleDay={toggleDay}
          updateTime={updateTime}
        />
      </CardContent>
    </Card>
  );
}

export default OpeningHoursForm;
