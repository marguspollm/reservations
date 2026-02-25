import { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  ListItem,
  IconButton,
  Alert,
} from "@mui/material";
import type { User } from "../../models/entities/User";
import {
  addAttendee,
  deleteAttendee,
  getAllAttendees,
} from "../../services/attendee.service";
import { getAllUsers } from "../../services/user.service";
import type { Attendee } from "../../models/entities/Attendee";
import type { Reservation } from "../../models/entities/Reservation";
import { getActiveInstances } from "../../services/reservation.service";
import { useFetch } from "../../hooks/useFetch";
import { useAsyncFetch } from "../../hooks/useAsyncFetch";
import { t } from "i18next";
import Notifiy from "../../components/Notifiy";
import RemoveIcon from "@mui/icons-material/Remove";
import { isChanged, validateAttendeeForm } from "../../utils/validations";
import type { AttendeeFormError } from "../../models/FormErrors";

function AttendeeAdminPage() {
  const [instances, setInstances] = useState<Reservation[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Reservation | null>(
    null,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validateErrors, setValidateErrors] = useState<AttendeeFormError>({});

  const [deleteingId, setDeletingId] = useState<number | null>(null);

  const { data: users, loading: usersLoading } = useFetch(() => getAllUsers());

  const { execute: instanceExecute, loading: instanceLoading } =
    useAsyncFetch();

  const { execute: attendeeExecute, loading: attendeeLoading } =
    useAsyncFetch();

  const { execute: saveExecute, loading: saveLoading } = useAsyncFetch();

  const { execute: deleteExecute, loading: deleteLoading } = useAsyncFetch();

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const data = await instanceExecute(getActiveInstances);
        if (!isChanged(data, instances)) return;
        setInstances(data);
        setSelectedInstance(null);
      } catch (err) {
        setErrorMessage((err as Error).message);
      }
    };
    fetchInstances();

    const interval = setInterval(
      () => {
        fetchInstances();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [instanceExecute, instances]);

  useEffect(() => {
    const getAttendees = async () => {
      if (!selectedInstance?.id) return;
      try {
        const data = await attendeeExecute(
          getAllAttendees,
          selectedInstance.id,
        );
        setAttendees(data);
      } catch (err) {
        setErrorMessage((err as Error).message);
      }
    };

    getAttendees();
  }, [selectedInstance?.id, attendeeExecute]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!selectedInstance?.id) return;

    setValidateErrors({});

    const errors = validateAttendeeForm(email, name, selectedUser?.id);
    if (Object.keys(errors).length !== 0) {
      setValidateErrors(errors);
      return;
    }

    let payload: Attendee = {
      email: email,
      fullName: name,
    };

    if (selectedUser?.id) {
      payload = { userId: selectedUser.id };
    }

    try {
      const data = await saveExecute(addAttendee, selectedInstance.id, payload);
      setName("");
      setEmail("");
      setSelectedUser(null);
      setAttendees(prev => [...prev, data]);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const handleAttendeeDelete = async (id: number) => {
    if (!id || !selectedInstance?.id) return;
    try {
      setDeletingId(id);
      const res = await deleteExecute(deleteAttendee, selectedInstance?.id, id);
      setAttendees(res);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!instances)
    return <Typography>{t("error.notfound.active-instances")}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid>
          <Card>
            <CardHeader title={t("attendee.form.selectinstance")} />
            <Divider />
            <List
              sx={{ maxHeight: 400, overflow: "auto", alignContent: "center" }}
            >
              {instanceLoading ? (
                <Box>
                  <CircularProgress size={28} />
                </Box>
              ) : instances.length === 0 ? (
                <ListItemText
                  primary={t("attendee.instances.noactive")}
                  sx={{ pl: 2, pt: 1 }}
                />
              ) : (
                instances.map(res => (
                  <ListItemButton
                    key={res.id}
                    selected={selectedInstance?.id === res.id}
                    onClick={() => setSelectedInstance(res)}
                  >
                    <ListItemText primary={res.title} />
                  </ListItemButton>
                ))
              )}
            </List>
          </Card>
        </Grid>

        <Grid>
          {selectedInstance && (
            <Card>
              <CardHeader
                title={
                  selectedInstance
                    ? `${t("attendee.form.addpersonto")}: ${selectedInstance.title}`
                    : t("attendee.selectactivereservation")
                }
              />
              <Divider />
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  component="form"
                  onSubmit={e => handleSubmit(e)}
                  noValidate
                >
                  <TextField
                    label={t("attendee.form.add.name")}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    error={!!validateErrors?.name}
                    helperText={validateErrors?.name}
                  />

                  <TextField
                    label={t("attendee.form.add.email")}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                  />

                  <Autocomplete
                    options={users || []}
                    getOptionLabel={option =>
                      `${option.firstname} (${option.email})`
                    }
                    loading={usersLoading}
                    value={selectedUser}
                    onChange={(_, newValue) => setSelectedUser(newValue)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={t("attendee.form.searchuser")}
                        error={!!validateErrors?.general}
                        helperText={validateErrors?.general}
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {usersLoading && <CircularProgress size={18} />}
                                {params.InputProps?.endAdornment}
                              </>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!selectedInstance}
                    loading={saveLoading}
                  >
                    {t("button.addattendee")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid>
          <List dense>
            {attendeeLoading && (
              <Box>
                <CircularProgress size={28} />
              </Box>
            )}
            {attendees.map(attendee => (
              <ListItem
                key={attendee.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleAttendeeDelete(Number(attendee.id))}
                    disabled={deleteLoading && deleteingId === attendee.id}
                  >
                    <RemoveIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={attendee.fullName}
                  secondary={`ID: ${attendee.id}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Notifiy
        message={successMessage}
        error={errorMessage}
        closeSuccess={() => setSuccessMessage(null)}
        closeError={() => setErrorMessage(null)}
      />
    </Box>
  );
}

export default AttendeeAdminPage;
