import { Container, Box, Typography, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Box
        minHeight="80vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h1" fontWeight={700} color="primary" gutterBottom>
          404
        </Typography>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          {t("page-not-found")}
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          {t("page-doesnot-exist")}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" component={Link} to="/">
            {t("go-home")}
          </Button>

          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t("go-back")}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default NotFound;
