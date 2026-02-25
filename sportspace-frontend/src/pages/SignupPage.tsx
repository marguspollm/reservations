import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Stack,
  Alert,
} from "@mui/material";
import type { Signup } from "../models/requests/Signup";
import { signup } from "../services/auth.service";
import { signupObject } from "../utils/objects";
import { useNavigate } from "react-router";
import type { FormError } from "../models/FormErrors";
import { useAsyncFetch } from "../hooks/useAsyncFetch";
import { useTranslation } from "react-i18next";
import { validateSignupForm } from "../utils/validations";
import Notifiy from "../components/Notifiy";

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { execute, loading } = useAsyncFetch();
  const [formData, setFormData] = useState<Signup>(signupObject);

  const [validateError, setValidateError] = useState<FormError>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setValidateError({});

    const errors = validateSignupForm(formData);
    if (Object.keys(errors).length !== 0) {
      setValidateError(errors);
      return;
    }

    try {
      const res = await execute(signup, formData);
      if (!res.id) {
        setError(t(`error.signup.failed`));
        return;
      }
      setFormData(signupObject);
      setSuccessMessage(t("success.user.created"));
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err instanceof Error) setError(t(`error.tryagainlater`));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={{
            width: "100%",
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Stack spacing={2} alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight={600}>
              {t("signup-page.header")}
            </Typography>
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={1}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label={t("user.form.email")}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!validateError.email}
                  helperText={validateError.email}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label={t("user.form.password")}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!validateError.password}
                  helperText={validateError.password}
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  fullWidth
                  required
                  label={t("user.form.firstname")}
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  error={!!validateError.firstname}
                  helperText={validateError.firstname}
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  fullWidth
                  label={t("user.form.lastname")}
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={7}>
                <TextField
                  fullWidth
                  label={t("user.form.phone")}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              loading={loading}
            >
              {t("button.signup")}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={2}
            ></Typography>
          </Box>
        </Box>
      </Box>
      <Notifiy
        message={successMessage}
        closeSuccess={() => setSuccessMessage(null)}
      />
    </Container>
  );
}
