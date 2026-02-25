import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useParams } from "react-router";
import type { User } from "../../../models/entities/User";
import { getUser, updateUser } from "../../../services/user.service";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import { useAsyncFetch } from "../../../hooks/useAsyncFetch";
import { t } from "i18next";
import Loading from "../../../components/Loading";
import NotFound from "../../NotFound";
import type { UserError } from "../../../models/FormErrors";
import { isChanged, validateUser } from "../../../utils/validations";
import Notifiy from "../../../components/Notifiy";

function UserDetailsAdminPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [validateError, setValidateError] = useState<UserError>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { execute, loading, error } = useAsyncFetch();

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async (userId: number) => {
      const data = await execute(getUser, userId);
      setUser(data);
      setOriginalUser(data);
    };

    fetchUser(Number(userId));
  }, [userId, execute]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!user) return;

    const { name, value } = e.target;
    setUser(prev => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userId || !user) return;

    setValidateError({});

    const errors = validateUser(user);
    if (Object.keys(errors).length !== 0) {
      setValidateError(errors);
      return;
    }

    const res = await execute(updateUser, Number(userId), user);
    setUser(res);
    setOriginalUser(res);
    setSuccessMessage(t("success.user.updated"));
  };

  const handleCancel = () => {
    setUser(originalUser);
  };

  const isDirty = useMemo(() => {
    return isChanged(user, originalUser);
  }, [user, originalUser]);

  if (loading) return <Loading open />;
  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  if (!user) return <NotFound />;

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              {t("user-page.header")}
            </Typography>

            <Divider />

            <TextField
              label={t("user.id")}
              value={user.id}
              fullWidth
              disabled
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("user.firstname")}
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                required
                fullWidth
                error={!!validateError.firstname}
                helperText={validateError.firstname}
              />

              <TextField
                label={t("user.lastname")}
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                fullWidth
              />
            </Stack>

            <TextField
              label={t("user.email")}
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              fullWidth
              error={!!validateError.email}
              helperText={validateError.email}
            />

            <TextField
              label={t("user.phonenumber")}
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              fullWidth
            />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ pt: 2 }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                loading={loading}
                disabled={!isDirty}
              >
                {t("button.cancel")}
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                disabled={!isDirty}
              >
                {t("button.save")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
      <Notifiy
        message={successMessage}
        closeSuccess={() => setSuccessMessage(null)}
      />
    </Card>
  );
}

export default UserDetailsAdminPage;
