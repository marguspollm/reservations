import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState, type SyntheticEvent } from "react";
import { login } from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import type { FormError } from "../models/FormErrors";
import { useAsyncFetch } from "../hooks/useAsyncFetch";
import { useTranslation } from "react-i18next";
import { validateLoginForm } from "../utils/validations";

function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);

  const [validateError, setValidateError] = useState<FormError>({});
  const [error, setError] = useState<string | null>(null);

  const { execute, loading } = useAsyncFetch();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setValidateError({});
    setError(null);

    const errors = validateLoginForm(email, password);
    if (Object.keys(errors).length !== 0) {
      setValidateError(errors);
      return;
    }

    try {
      const res = await execute(login, email, password);
      if (!res.token) {
        setError(t("error.login.failed"));
      }
      setEmail("");
      setPassword("");
      handleLogin(res.token);
    } catch (err) {
      if (err instanceof Error) setError(t("error.tryagainlater"));
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
        <Card sx={{ width: "100%", p: 2 }} elevation={3}>
          <CardContent>
            <Stack spacing={1} mb={4} textAlign="center">
              <Typography variant="h4" fontWeight={600}>
                {t("login-page.header")}
              </Typography>
            </Stack>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label={t("user.form.email")}
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                error={!!validateError.email}
                helperText={validateError.email}
              />

              <TextField
                label={t("user.form.password")}
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                error={!!validateError.password}
                helperText={validateError.password}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                loading={loading}
                disabled={!email && !password}
              >
                {t("button.login")}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default LoginPage;
