import {
  Container,
  Card,
  CardHeader,
  Typography,
  Divider,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { Link } from "react-router";
import { getStatusColor } from "../../utils/reservationUtils";
import type { Reservation } from "../../models/entities/Reservation";
import { useTranslation } from "react-i18next";

type ReservationTableProps = {
  data: Reservation[];
  onDelete?: (id: number) => void;
  getEditLink: (res: Reservation) => string;
  disableDelete?: number | null;
  loadingDelete?: boolean;
};

function ReservationManage({
  data,
  onDelete,
  getEditLink,
  disableDelete,
  loadingDelete,
}: ReservationTableProps) {
  const { t } = useTranslation();
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              {t("reservations")}
            </Typography>
          }
          subheader={`${data.filter(res => res.status === "REQUESTED").length} ${t("pending-reservations")}`}
        />

        <Divider />

        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: theme => theme.palette.grey[100],
                  }}
                >
                  <TableCell>
                    <strong>{t("res.details.id")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("res.details.title")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("res.details.room")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("res.details.status")}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{t("actions")}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t("error.notfound.reservations")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map(reservation => (
                    <TableRow
                      key={reservation.id}
                      hover
                      sx={{
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: theme => theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{reservation.title}</TableCell>
                      <TableCell>{reservation.roomId}</TableCell>

                      <TableCell>
                        <Chip
                          label={t(
                            `res.status.${reservation.status.toLowerCase()}`,
                          )}
                          color={getStatusColor(reservation.status)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            component={Link}
                            to={getEditLink(reservation)}
                            variant="contained"
                            size="small"
                          >
                            {t("button.edit")}
                          </Button>

                          {onDelete && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => onDelete(reservation.id)}
                              disabled={disableDelete === reservation.id}
                              loading={loadingDelete}
                            >
                              {t("button.delete")}
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ReservationManage;
