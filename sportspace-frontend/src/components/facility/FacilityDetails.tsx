import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import type { Facility } from "../../models/entities/Facility";
import { useTranslation } from "react-i18next";
import type { FacilityFormError } from "../../models/FormErrors";
import type { FacilityRequest } from "../../models/requests/FacilityRequest";

type FacilityDetailsProps = {
  facility: Facility | FacilityRequest;
  onChange: (field: string, value: string | boolean) => void;
  errors?: FacilityFormError;
};

function FacilityDetails({ facility, onChange, errors }: FacilityDetailsProps) {
  const { t } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange(name, type === "checkbox" ? checked : value);
  };

  return (
    <Card>
      <CardHeader title={t("facility-details.header")} />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label={t("facility-details.name")}
            name="name"
            value={facility.name}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors?.name}
            helperText={errors?.name}
          />
          <TextField
            label={t("facility-details.address")}
            name="address"
            value={facility.address}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors?.address}
            helperText={errors?.address}
          />
          <FormControlLabel
            control={
              <Switch
                name="active"
                checked={facility.active}
                onChange={handleChange}
              />
            }
            label={t("facility-details.active")}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FacilityDetails;
