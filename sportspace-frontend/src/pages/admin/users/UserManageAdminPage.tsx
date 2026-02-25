import { useContext, useEffect, useState } from "react";
import {
  changeRole,
  deleteUser,
  getAllUsers,
} from "../../../services/user.service";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import { Link } from "react-router";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/Loading";
import { AuthContext } from "../../../context/AuthContext";
import { useAsyncFetch } from "../../../hooks/useAsyncFetch";
import { t } from "i18next";
import Notifiy from "../../../components/Notifiy";

function UserManageAdminPage() {
  const { user: authUser } = useContext(AuthContext);
  const users = useFetch(() => getAllUsers());

  const { execute: deleteExecute, loading: deleteLoading } = useAsyncFetch();

  const { execute: roleChangeExecute, loading: roleChangeLoading } =
    useAsyncFetch();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [roleChangeId, setRoleChangeId] = useState<number | null>(null);

  const [successMessage, setSuccesssMesssage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!users) return;
    const errorFetch = () => {
      if (users.error) setError(users.error);
    };
    errorFetch();
  }, [users]);

  const handleDelete = async (id: number) => {
    if (!id) return;

    setDeletingId(id);
    try {
      const res = await deleteExecute(deleteUser, id.toString());
      setSuccesssMesssage(t("success.users.deleted"));
      users.setData(res);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleChangeRole = async (id: number) => {
    if (!id) return;
    setRoleChangeId(id);

    try {
      const res = await roleChangeExecute(changeRole, id.toString());
      setSuccesssMesssage(t("success.users.role-changed"));

      users.setData(prevUsers => {
        if (!prevUsers) return prevUsers;

        return prevUsers.map(user => {
          if (user.id === id) return res;
          return user;
        });
      });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setRoleChangeId(null);
    }
  };

  const isSelf = (id: number) => authUser?.id === id;

  if (users.loading) return <Loading open />;
  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  if (!users.data)
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {t("error.notfound.users")}
      </Alert>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              {t("users")}
            </Typography>
          }
        />

        <Divider />

        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: theme => theme.palette.grey[100],
                  }}
                >
                  <TableCell>
                    <strong>{t("user.id")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("user.email")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("user.name")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("user.phone")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("user.roles")}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{t("actions")}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t("error.notfound.users")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.data.map(user => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: theme => theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.firstname + " " + user.lastname}
                      </TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {user.roles.map(role => (
                            <Chip key={role} label={role} size="small" />
                          ))}
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            component={Link}
                            to={`/user-details/${user.id}/`}
                            variant="contained"
                            size="small"
                          >
                            {t("button.edit")}
                          </Button>

                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id || isSelf(user.id)}
                            loading={deleteLoading && !!deletingId}
                          >
                            {t("button.delete")}
                          </Button>
                          <Button
                            variant="contained"
                            onClick={e => {
                              e.stopPropagation();
                              handleChangeRole(user.id);
                            }}
                            disabled={
                              roleChangeId === user.id || isSelf(user.id)
                            }
                            loading={roleChangeLoading}
                          >
                            {t("button.change-role")}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Notifiy
        error={error}
        message={successMessage}
        closeError={() => setError(null)}
        closeSuccess={() => setSuccesssMesssage(null)}
      />
    </Container>
  );
}

export default UserManageAdminPage;
