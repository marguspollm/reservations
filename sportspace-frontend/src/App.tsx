import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CalendarPage from "./pages/CalendarPage";
import UserManageAdminPage from "./pages/admin/users/UserManageAdminPage";
import UserDetailsAdminPage from "./pages/admin/users/UserDetailsAdminPage";
import FacilityManageAdminPage from "./pages/admin/facilities/FacilityManageAdminPage";
import FacilityDetailsAdminPage from "./pages/admin/facilities/FacilityDetailsAdminPage";
import FacilityCreateAdminPage from "./pages/admin/facilities/FacilityCreateAdminPage";
import ProfilePage from "./pages/private/ProfilePage";
import ReservationCreatePage from "./pages/private/ReservationCreatePage";
import NotFound from "./pages/NotFound";
import ReservationAdminPage from "./pages/admin/reservations/ReservationManageAdminPage";
import ReservationDetailsAdminPage from "./pages/admin/reservations/ReservationDetailsAdminPage";
import Header from "./components/Header";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import AttendeeAdminPage from "./pages/admin/AttendeeAdminPage";
import MyReservations from "./pages/private/MyReservations";
import MyReservationDetailsPage from "./pages/private/MyReservationDetailsPage";
import { Box } from "@mui/material";
import Footer from "./components/Footer";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language;

    dayjs.locale(lang);
    dayjs.updateLocale(lang, { weekStart: 1 });
  }, [i18n.language]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "background.paper",
          }}
        >
          <Header />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/calendar" element={<CalendarPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/create-reservation"
                element={<ReservationCreatePage />}
              />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route
                path="/my-reservations/:reservationId"
                element={<MyReservationDetailsPage />}
              />

              <Route
                element={<RequireRole allowedRoles={["ADMIN", "SUPERADMIN"]} />}
              >
                <Route
                  path="/facilities"
                  element={<FacilityManageAdminPage />}
                />
                <Route
                  path="/facility-details/:facilityId"
                  element={<FacilityDetailsAdminPage />}
                />
                <Route
                  path="/create-facility"
                  element={<FacilityCreateAdminPage />}
                />
                <Route
                  path="/reservations"
                  element={<ReservationAdminPage />}
                />
                <Route
                  path="/reservations/active"
                  element={<AttendeeAdminPage />}
                />
                <Route
                  path="/reservation-details/:reservationId"
                  element={<ReservationDetailsAdminPage />}
                />
              </Route>

              <Route element={<RequireRole allowedRoles={["SUPERADMIN"]} />}>
                <Route path="/users" element={<UserManageAdminPage />} />
                <Route
                  path="/user-details/:userId"
                  element={<UserDetailsAdminPage />}
                />
              </Route>
            </Route>

            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Box>

        <Box
          component="footer"
          sx={{
            backgroundColor: "grey.100",
            py: 2,
            textAlign: "center",
          }}
        >
          <Footer />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
