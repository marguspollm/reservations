import { useContext, useMemo, useState, type ChangeEvent } from "react";
import type { User } from "../../models/entities/User";
import { updateMe } from "../../services/user.service";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Alert,
} from "@mui/material";
import NotFound from "../NotFound";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useAsyncFetch } from "../../hooks/useAsyncFetch";
import { isChanged, validateUser } from "../../utils/validations";
import type { UserError } from "../../models/FormErrors";
import Loading from "../../components/Loading";
import SuccessNotifiy from "../../components/Notifiy";

function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<User | null>(user);
  const [originalUserInfo, setOriginalUserInfo] = useState<User | null>(user);

  const [validateError, setValidateError] = useState<UserError>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    return isChanged(userInfo, originalUserInfo);
  }, [userInfo, originalUserInfo]);

  const { execute, loading, error } = useAsyncFetch();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserInfo(prev => (prev ? { ...prev, [name]: value.trim() } : prev));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInfo || loading) return;

    setValidateError({});

    const errors = validateUser(userInfo);
    if (Object.keys(errors).length !== 0) {
      setValidateError(errors);
      return;
    }

    const res = await execute(updateMe, userInfo);
    setSuccessMessage(t("success.profile.updated"));

    setUserInfo(res);
    setOriginalUserInfo(res);
  };

  const handleCancel = () => {
    setUserInfo(originalUserInfo);
  };

  if (loading) return <Loading open />;
  if (!user?.id || !userInfo) return <NotFound />;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: 28,
              }}
            >
              {user.firstname?.[0]}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={600}>
                {t("myprofile")}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid>
                <TextField
                  label={t("user.form.firstname")}
                  name="firstname"
                  value={userInfo.firstname}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!validateError.firstname}
                  helperText={validateError.firstname}
                />
              </Grid>

              <Grid>
                <TextField
                  label={t("user.form.lastname")}
                  name="lastname"
                  value={userInfo.lastname}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid>
                <TextField
                  label={t("user.form.email")}
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!validateError.email}
                  helperText={validateError.email}
                />
              </Grid>

              <Grid>
                <TextField
                  label={t("user.form.phone")}
                  name="phoneNumber"
                  value={userInfo.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={!isDirty}
                loading={loading}
              >
                {t("button.cancel")}
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty}
                loading={loading}
              >
                {t("button.save")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <SuccessNotifiy
        message={successMessage}
        closeSuccess={() => setSuccessMessage(null)}
      />
    </Container>
  );
}

export default ProfilePage;
