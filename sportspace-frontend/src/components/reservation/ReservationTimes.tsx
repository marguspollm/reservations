import {
  Accordion,
  AccordionSummary,
  Stack,
  Typography,
  IconButton,
  AccordionDetails,
} from "@mui/material";
import { formatDate } from "../../utils/reservationUtils";
import type { Reservation } from "../../models/entities/Reservation";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import RemoveIcon from "@mui/icons-material/Remove";

type ReservationTimesProps = {
  reservation: Reservation;
  deleteInstance: (e: React.MouseEvent, id: number) => void;
  deleteTime: (e: React.MouseEvent, id?: number) => void;
  canEdit?: boolean;
  canDeleteTimes?: boolean;
  disabled: boolean;
};

function ReservationTimes({
  reservation,
  deleteInstance,
  deleteTime,
  canEdit,
  canDeleteTimes,
  disabled,
}: ReservationTimesProps) {
  return (
    <>
      {reservation.instances.map(inst => {
        const { earliestStart, latestEnd, date } = inst;
        return (
          <Accordion key={inst.id}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <AccordionSummary>
                <Typography fontWeight={500}>
                  {`${formatDate(date)} ${earliestStart} - ${latestEnd}`}
                </Typography>
              </AccordionSummary>
              {canEdit && !disabled && (
                <IconButton
                  type="button"
                  color="error"
                  onClick={e => deleteInstance(e, Number(inst.id))}
                >
                  <PlaylistRemoveIcon />
                </IconButton>
              )}
            </Stack>

            <AccordionDetails>
              <Stack spacing={1}>
                {inst.times.map(time => (
                  <Stack
                    key={time.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Typography>
                      {time.startTime.slice(0, 5)} – {time.endTime.slice(0, 5)}
                    </Typography>
                    {canDeleteTimes && !disabled && (
                      <IconButton
                        color="error"
                        type="button"
                        onClick={e => deleteTime(e, time.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}

export default ReservationTimes;
