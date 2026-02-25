import { useParams } from "react-router";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import Loading from "../../../components/Loading";
import OpeningHoursForm from "../../../components/facility/OpeningHoursForm";
import RoomsForm from "../../../components/facility/RoomsForm";
import FacilityDetails from "../../../components/facility/FacilityDetails";
import { useFacility } from "../../../hooks/useFacility";
import { useTranslation } from "react-i18next";
import NotFound from "../../NotFound";
import SuccessNotifiy from "../../../components/Notifiy";

function FacilityDetailsAdminPage() {
  const { t } = useTranslation();
  const { facilityId } = useParams();

  const {
    facility,
    error,
    addRoom,
    updateRoom,
    deleteRoom,
    toggleDay,
    updateTime,
    save,
    handleChange,
    validateError,
    isDirty,
    cancel,
    successMessage,
    setSuccessMessage,
    initLoading,
    formLoading,
    setError,
  } = useFacility(facilityId);

  if (initLoading || formLoading) return <Loading open />;
  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  if (!initLoading && !facility) return <NotFound />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600}>
        {t("facility-page.header")}
      </Typography>
      {successMessage && <Loading open />}
      <Stack spacing={2} component={"form"} onSubmit={save} noValidate>
        <FacilityDetails
          facility={facility!}
          onChange={handleChange}
          errors={validateError}
        />

        <OpeningHoursForm
          schedules={facility!.schedules}
          toggleDay={toggleDay}
          updateTime={updateTime}
          errors={validateError}
        />

        <RoomsForm
          rooms={facility!.rooms}
          updateRoom={updateRoom}
          addRoom={addRoom}
          deleteRoom={deleteRoom}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={!isDirty}
              loading={formLoading}
            >
              {t("button.save-changes")}
            </Button>
            <Button
              variant="outlined"
              onClick={cancel}
              loading={formLoading}
              disabled={!isDirty}
            >
              {t("button.cancel-changes")}
            </Button>
          </Stack>
        </Box>
      </Stack>
      <SuccessNotifiy
        error={error}
        message={error || successMessage}
        closeSuccess={() => setSuccessMessage(null)}
        closeError={() => setError(null)}
      />
    </Container>
  );
}

export default FacilityDetailsAdminPage;
