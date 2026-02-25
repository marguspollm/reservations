import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
  Alert,
} from "@mui/material";
import { Link } from "react-router";
import {
  deleteFacility,
  getAllFacilities,
} from "../../../services/facility.service";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/Loading";
import { useTranslation } from "react-i18next";
import { useAsyncFetch } from "../../../hooks/useAsyncFetch";
import { useState } from "react";
import Notifiy from "../../../components/Notifiy";

function FacilityManageAdminPage() {
  const { t } = useTranslation();
  const facilities = useFetch(() => getAllFacilities());
  const { execute: deleteExecute, loading: deleteLoading } = useAsyncFetch();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id?: number) => {
    if (!id) return;

    setDeletingId(id);
    try {
      await deleteExecute(deleteFacility, id.toString());
      facilities.setData(prev => (prev ? prev.filter(f => f.id !== id) : prev));

      setSuccessMessage(t("success.facility.deleted"));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (facilities.loading) return <Loading open />;
  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  if (!facilities.data)
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {t("error.notfound.facilities")}
      </Alert>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Link to="/create-facility">
        <Button variant="contained" color="primary">
          {t("button.add.facility")}
        </Button>
      </Link>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              {t("facilities")}
            </Typography>
          }
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
                    <strong>{t("facility.id")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("facility.name")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("facility.address")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("facility.active")}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{t("actions")}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {facilities.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t("error.notfound.facilities")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  facilities.data.map(facility => (
                    <TableRow
                      key={facility.id}
                      hover
                      sx={{
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: theme => theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>{facility.id}</TableCell>
                      <TableCell>{facility.name}</TableCell>
                      <TableCell>{facility.address}</TableCell>
                      <TableCell>{facility.active.toString()}</TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            component={Link}
                            to={`/facility-details/${facility.id}/`}
                            variant="contained"
                            size="small"
                          >
                            {t("button.edit")}
                          </Button>

                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(facility.id)}
                            disabled={
                              deleteLoading && deletingId == facility.id
                            }
                          >
                            {t("button.delete")}
                          </Button>
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
      <Notifiy
        error={error}
        message={successMessage}
        closeError={() => setError(null)}
        closeSuccess={() => setSuccessMessage(null)}
      />
    </Container>
  );
}

export default FacilityManageAdminPage;
