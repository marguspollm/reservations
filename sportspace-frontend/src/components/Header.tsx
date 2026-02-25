import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

function Header() {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn, handleLogout } = useContext(AuthContext);

  const isAdmin = user?.roles.includes("ADMIN") || false;
  const isSuperAdmin = user?.roles.includes("SUPERADMIN") || false;

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (open: boolean) => () => {
    setMenuOpen(open);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "et" : "en";
    i18n.changeLanguage(newLang);
    dayjs.locale(newLang);
  };

  const mobileMenu = (
    <Box sx={{ width: 260 }} role="presentation" onClick={toggleMenu(false)}>
      <Divider />

      <List>
        <ListItemButton component={Link} to="/calendar">
          <ListItemText primary={t("calendar")} />
        </ListItemButton>

        {isLoggedIn && (
          <>
            <ListItemButton component={Link} to="/create-reservation">
              <ListItemText primary={t("create-reservation")} />
            </ListItemButton>

            <ListItemButton component={Link} to="/my-reservations">
              <ListItemText primary={t("my-reservations")} />
            </ListItemButton>
          </>
        )}

        {isAdmin && (
          <>
            <ListItemButton component={Link} to="/reservations">
              <ListItemText primary={t("reservations")} />
            </ListItemButton>

            <ListItemButton component={Link} to="/reservations/active">
              <ListItemText primary={t("actice-reservations")} />
            </ListItemButton>
          </>
        )}

        {isSuperAdmin && (
          <>
            <ListItemButton component={Link} to="/users">
              <ListItemText primary={t("users")} />
            </ListItemButton>

            <ListItemButton component={Link} to="/facilities">
              <ListItemText primary={t("facilities")} />
            </ListItemButton>
          </>
        )}

        <Divider sx={{ my: 1 }} />

        {isLoggedIn ? (
          <>
            <ListItemButton component={Link} to="/profile">
              <ListItemText primary={t("profile")} />
            </ListItemButton>

            <ListItemButton onClick={handleLogout}>
              <ListItemText primary={t("logout")} />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton component={Link} to="/login">
              <ListItemText primary={t("login")} />
            </ListItemButton>

            <ListItemButton component={Link} to="/signup">
              <ListItemText primary={t("signup")} />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, flexGrow: 1 }}>
          <Button component={Link} to="/calendar" color="inherit">
            {t("calendar")}
          </Button>
          <Button color="inherit" onClick={toggleLanguage} size="small">
            {i18n.language === "en" ? "EE" : "EN"}
          </Button>

          {isLoggedIn && (
            <>
              <Button component={Link} to="/create-reservation" color="inherit">
                {t("create-reservation")}
              </Button>

              <Button component={Link} to="/my-reservations" color="inherit">
                {t("my-reservations")}
              </Button>
            </>
          )}

          {isAdmin && (
            <>
              <Button component={Link} to="/reservations" color="inherit">
                {t("reservations")}
              </Button>

              <Button
                component={Link}
                to="/reservations/active"
                color="inherit"
              >
                {t("active-reservations")}
              </Button>
            </>
          )}

          {isSuperAdmin && (
            <>
              <Button component={Link} to="/users" color="inherit">
                {t("users")}
              </Button>

              <Button component={Link} to="/facilities" color="inherit">
                {t("facilities")}
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button component={Link} to="/profile" color="inherit">
                {t("profile")}
              </Button>

              <Button
                color="secondary"
                variant="contained"
                onClick={handleLogout}
              >
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
              >
                {t("login")}
              </Button>

              <Button component={Link} to="/signup" color="inherit">
                {t("signup")}
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={toggleMenu(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer anchor="right" open={menuOpen} onClose={toggleMenu(false)}>
          {mobileMenu}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
