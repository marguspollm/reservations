import { Paper, Stack, Button } from "@mui/material";
import Loading from "../../../components/Loading";
import FacilityDetails from "../../../components/facility/FacilityDetails";
import OpeningHoursForm from "../../../components/facility/OpeningHoursForm";
import RoomsForm from "../../../components/facility/RoomsForm";
import { useTranslation } from "react-i18next";
import useCreateFacility from "../../../hooks/useCreateFacility";
import Notifiy from "../../../components/Notifiy";

function FacilityCreateAdminPage() {
  const { t } = useTranslation();

  const {
    facility,
    loading,
    error,
    save,
    handleChange,
    validateError,
    toggleDay,
    updateTime,
    addRoom,
    deleteRoom,
    updateRoom,
    cancel,
    successMessage,
    setSuccessMessage,
    isDirty,
    setError,
  } = useCreateFacility();

  if (loading) return <Loading open />;

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <h2>{t("facility-add-page.header")}</h2>

      <Stack spacing={2} component={"form"} onSubmit={save} noValidate>
        <FacilityDetails
          facility={facility}
          onChange={handleChange}
          errors={validateError}
        />

        <OpeningHoursForm
          schedules={facility.schedules}
          toggleDay={toggleDay}
          updateTime={updateTime}
          errors={validateError}
        />

        <RoomsForm
          rooms={facility.rooms ?? []}
          updateRoom={updateRoom}
          addRoom={addRoom}
          deleteRoom={deleteRoom}
          errors={validateError}
        />

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={cancel} loading={loading}>
            {t("button.cancel")}
          </Button>
          <Button
            variant="contained"
            type="submit"
            loading={loading}
            disabled={!isDirty}
          >
            {t("button.save")}
          </Button>
        </Stack>
      </Stack>
      <Notifiy
        error={error}
        message={successMessage}
        closeSuccess={() => setSuccessMessage(null)}
        closeError={() => setError(null)}
      />
    </Paper>
  );
}

export default FacilityCreateAdminPage;
