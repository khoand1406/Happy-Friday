import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import enLocale from "@fullcalendar/core/locales/en-gb";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import MainLayout from "./MainLayout";
import {
  getEvents,
  getEventDetail,
  createEvent,
} from "../services/events.service";
import type {
  EventDetailResponse,
  EventResponse,
} from "../models/response/event.response";
import type { UserBasicRespone } from "../models/response/user.response";
import { getMembers } from "../services/user.service";
import type { CreateEventRequest } from "../models/request/event.request";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";

export default function CalendarLayout() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    content: "",
    start: "",
    end: "",
  });
  const [eventDetail, setEventDetail] = useState<EventDetailResponse | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [users, setUsers] = useState<UserBasicRespone[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserBasicRespone[]>([]);

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const payload: CreateEventRequest = {
        title: newEvent.title,
        content: newEvent.content,
        startDate: new Date(newEvent.start),
        endDate: new Date(newEvent.end),
        invitees: selectedUser.map((user) => user.user_id),
      };
      try {
        const response = await createEvent(payload);
        if (response) {
          toast.success("Create event successfully!!");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error("An error occur! Try again");
        }
      } finally {
        setOpenModal(false);
        setNewEvent({ title: "", content: "", start: "", end: "" });
        setSelectedUser([]);
      }
    }
  };

  useEffect(() => {
    if (openModal) {
      const fetchUsers = async () => {
        try {
          const data = await getMembers();
          setUsers(data);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      };
      fetchUsers();
    }
  }, [openModal]);
  return (
    <MainLayout>
      <Grid
        container
        spacing={2}
        sx={{ height: "calc(100vh - 80px)", overflow: "hidden" }}
      >
        {/* SIDE CALENDAR */}
        <Grid
          size={{ xs: 3 }}
          sx={{
            position: "sticky",
            top: 0,
            height: "100%",
            borderRight: "1px solid #e0e0e0",
            p: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Monthly Calendar
          </Typography>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* MAIN CALENDAR */}
        <Grid
          size={{ xs: 9 }}
          sx={{
            height: "100%",
            overflowY: "auto",
            backgroundColor: "#fafafa",
            p: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold">
              Work Schedule
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              + Create Event
            </Button>
          </Box>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={enLocale}
            firstDay={0}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="100%"
            events={async (fetchInfo, successCallback, failureCallback) => {
              try {
                const data: EventResponse[] = await getEvents(
                  fetchInfo.startStr,
                  fetchInfo.endStr
                );
                const mapped = data.map((item) => ({
                  id: item.id.toString(),
                  title: item.title,
                  start: item.startDate,
                  end: item.endDate,
                  backgroundColor: "rgba(255, 235, 59, 0.3)",
                  borderColor: "rgba(255, 213, 90, 0.6)",
                  textColor: "#333",
                }));
                successCallback(mapped);
              } catch (error: any) {
                console.error("Error fetching events:", error);
                failureCallback(error);
              }
            }}
            eventClick={async (info) => {
              try {
                const eventId = parseInt(info.event.id);
                const detail = await getEventDetail(eventId);
                setEventDetail(detail);
                setDetailDialogOpen(true);
              } catch (error) {
                console.error("Failed to fetch event detail:", error);
              }
            }}
          />
        </Grid>

        {/* CREATE EVENT MODAL */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Event</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />

            <TextField
              label="Content"
              value={newEvent.content}
              onChange={(e) =>
                setNewEvent({ ...newEvent, content: e.target.value })
              }
            />

            <TextField
              label="Start Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start: e.target.value })
              }
            />
            <TextField
              label="End Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end: e.target.value })
              }
            />
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              value={selectedUser}
              onChange={(_, newValue) => setSelectedUser(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Participants"
                  placeholder="Select users"
                />
              )}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <Box
      component="li"
      key={key}
      {...rest}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 1,
      }}
    >
                    <Avatar
                      src={
                        option.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          option.name
                        )}&background=random`
                      }
                      alt={option.name}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.department_name}
                      </Typography>
                    </Box>
                  </Box>
                );
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddEvent}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* EVENT DETAIL DIALOG */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            {eventDetail ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}
              >
                <Typography variant="h6">{eventDetail.title}</Typography>
                <Typography>{eventDetail.content}</Typography>
                <Typography>
                  🕒 {new Date(eventDetail.startDate).toLocaleString()} -{" "}
                  {new Date(eventDetail.endDate).toLocaleString()}
                </Typography>
                <Typography>
                  👤 <b>Organizer:</b> {eventDetail.creator.name}
                </Typography>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={30} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <ToastContainer></ToastContainer>
    </MainLayout>
  );
}
