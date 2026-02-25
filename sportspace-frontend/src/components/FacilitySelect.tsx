import { MenuItem, TextField } from "@mui/material";
import { t } from "i18next";
import type { Facility } from "../models/entities/Facility";
import type { ChangeEvent } from "react";

type FacilitySelectProps = {
  facilities: Facility[];
  facilityId: string;
  handleSelectFacility: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FacilitySelect({
  facilities,
  facilityId,
  handleSelectFacility,
}: FacilitySelectProps) {
  return (
    <TextField
      select
      fullWidth
      label={t("facilities")}
      value={facilityId}
      onChange={handleSelectFacility}
    >
      {facilities.map(f => (
        <MenuItem key={f.id} value={f.id}>
          {f.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default FacilitySelect;
