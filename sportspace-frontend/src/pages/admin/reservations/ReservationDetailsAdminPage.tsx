import ReservationDetails from "../../../components/reservation/ReservationDetails";

function ReservationDetailsAdminPage() {
  return (
    <ReservationDetails
      canSetStatus={true}
      canEdit={true}
      canDeleteTimes={true}
    />
  );
}

export default ReservationDetailsAdminPage;
