import {
  Card,
  CardHeader,
  Button,
  CardContent,
  Typography,
  Stack,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";

import type { Room } from "../../models/entities/Room";
import { useTranslation } from "react-i18next";
import type { FacilityFormError } from "../../models/FormErrors";

type RoomFormProps = {
  rooms: Room[];
  updateRoom: (id: number, name: string, value: unknown) => void;
  addRoom: () => void;
  deleteRoom: (id: number) => void;
  errors?: FacilityFormError;
};

function RoomsForm({
  rooms,
  updateRoom,
  addRoom,
  deleteRoom,
  errors,
}: RoomFormProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        title={t("room-details.header")}
        action={<Button onClick={addRoom}>{t("button.add-room")}</Button>}
      />
      <CardContent>
        {rooms.length === 0 && (
          <Typography>{t("room-details.no-rooms-yet")}</Typography>
        )}
        <Stack spacing={2}>
          {rooms.map((room, i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Stack spacing={2}>
                <TextField
                  required
                  label={t("room-details.name")}
                  value={room.name}
                  onChange={e => updateRoom(i, "name", e.target.value)}
                  error={!!errors?.rooms}
                  helperText={errors?.rooms}
                />
                <TextField
                  label={t("room-details.sport-type")}
                  value={room.sportType}
                  onChange={e => updateRoom(i, "sportType", e.target.value)}
                />
                <TextField
                  label={t("room-details.price")}
                  type="number"
                  value={room.price}
                  onChange={e => updateRoom(i, "price", Number(e.target.value))}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={room.active}
                      onChange={e => updateRoom(i, "active", e.target.checked)}
                    />
                  }
                  label={t("room-details.active")}
                />
                <Button color="error" onClick={() => deleteRoom(i)}>
                  {t("button.delete")}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RoomsForm;
