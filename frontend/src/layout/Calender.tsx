import enLocale from "@fullcalendar/core/locales/en-gb";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useRef } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "../context/UserContext";
import type { CreateEventRequest } from "../models/request/event.request";
import type {
  EventDetailResponse,
  Invite,
} from "../models/response/event.response";
import type { UserBasicRespone } from "../models/response/user.response";
import {
  acceptEvent,
  createEvent,
  deleteEvent,
  getEventDetail,
  getEvents,
  rejectEvent,
  updateEvent,
} from "../services/events.service";
import { getMembers } from "../services/user.service";
import { formatDate, formatDateLocal, toHanoiTime } from "../utils/DateFormat";
import MainLayout from "./MainLayout";
import UserDetailModal from "../components/user/UserDetailModal";
import dayjs from "dayjs";
export default function CalendarLayout() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    content: "",
    start: "",
    end: "",
  });
  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<number | null>(null);
  const [eventDetail, setEventDetail] = useState<EventDetailResponse | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [users, setUsers] = useState<UserBasicRespone[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserBasicRespone[]>([]);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [showPending, setShowPending] = useState(false);

  const [selectedUserDetail, setSelectedUserDetail] =
    useState<UserBasicRespone | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const { user } = useUser();
  const currentInvite = eventDetail?.attendees?.find(
    (a) => a.user_id === user?.id
  );
  const hasAccepted = currentInvite?.status === true;
  const [confirmed, setConfirmed] = useState<Invite[]>([]);
  const [pending, setPending] = useState<Invite[]>([]);
  const calendarRef = useRef<FullCalendar | null>(null);
  const handleAddEvent = async () => {
    if (!newEvent.start || !newEvent.end) {
      toast.warning("Please fill in all required fields!");
      return;
    }

    const payload: CreateEventRequest = {
      title: newEvent.title,
      content: newEvent.content,
      startDate: new Date(newEvent.start + ":00+07:00").toISOString(),
      endDate: new Date(newEvent.end + ":00+07:00").toISOString(),
      invitees: selectedUser.map((user) => user.user_id),
    };

    try {
      if (editMode && editingEventId) {
        await updateEvent(payload, editingEventId);
        toast.success("Event updated successfully!");
        const calendarApi = calendarRef.current?.getApi();
        const existingEvent = calendarApi?.getEventById(
          editingEventId.toString()
        );
        if (existingEvent) {
          existingEvent.setProp("title", payload.title);
          existingEvent.setStart(new Date(payload.startDate));
          existingEvent.setEnd(new Date(payload.endDate));
        }
      } else {
        const created = await createEvent(payload);

        toast.success("Event created successfully!");

        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi && created) {
          calendarApi.addEvent({
            id: created.id.toString(),
            title: created.title,
            start: new Date(created.startDate),
            end: new Date(created.endDate),
            backgroundColor: "rgba(246, 243, 156, 0.8)",
            borderColor: "#f5b800",
            textColor: "#000",
          });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("An error occurred! Try again");
      } else {
        toast.error("Unexpected error!");
      }
    } finally {
      setOpenModal(false);
      setNewEvent({ title: "", content: "", start: "", end: "" });
      setSelectedUser([]);
      setEditMode(false);
      setEditingEventId(null);
    }
  };

  const handleDateClick = (info: any) => {
    const start = new Date(info.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatInput = (d: any) => dayjs(d).format("YYYY-MM-DDTHH:mm");

    setNewEvent({
      title: "",
      content: "",
      start: formatInput(start),
      end: formatInput(end),
    });
    setOpenModal(true);
    setSelectedDate(info.date);
  };

  const fetchEvents = useCallback(
    async (fetchInfo: any, successCallback: any, failureCallback: any) => {
      try {
        const data = await getEvents(fetchInfo.startStr, fetchInfo.endStr);
        const mapped = data.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          start: toHanoiTime(item.startdate),
          end: toHanoiTime(item.enddate),
          backgroundColor: "rgba(246, 243, 156, 0.8)",
          borderColor: "#f5b800",
          textColor: "#000",
        }));
        successCallback(mapped);
      } catch (error) {
        console.error("Error fetching events:", error);
        failureCallback(error);
      }
    },
    []
  );

  const handleAcceptInvite = async (eventId: number) => {
    try {
      await acceptEvent(eventId);
      toast.info("Event confirmed successfully. Please be in-time");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("An error occurs! Try Again");
      } else {
        toast.error("An error occurs! Try Again");
        console.log(error);
      }
    } finally {
      setDetailDialogOpen(false);
    }
  };

  const handleDeclineInvite = async (eventId: number) => {
    try {
      await rejectEvent(eventId);
      toast.info("Event declined. See later time");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("An error occurs! Try Again");
      } else {
        toast.error("An error occurs! Try Again");
        console.log(error);
      }
    } finally {
      setDetailDialogOpen(false);
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
  const handleDateChange = (newDate: any) => {
    setSelectedDate(newDate);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi && newDate) {
      calendarApi.gotoDate(newDate);
    }
  };

  return (
    <MainLayout>
      <Grid
        container
        spacing={2}
        sx={{ height: "calc(100vh - 80px)", overflow: "hidden" }}
      >
        {/* SIDE CALENDAR */}
        <Grid
          size={{ xs: 4 }}
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
              <DateCalendar value={selectedDate} onChange={handleDateChange} />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* MAIN CALENDAR */}
        <Grid
          size={{ xs: 8 }}
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
              onClick={() => {
                setNewEvent({ title: "", content: "", start: "", end: "" });
                setSelectedUser([]);
                setSelectedDate(null);
                setOpenModal(true);
              }}
            >
              + Create Event
            </Button>
          </Box>

          <FullCalendar
            timeZone="local"
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={enLocale}
            firstDay={0}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="100%"
            events={fetchEvents}
            eventClick={async (info) => {
              try {
                const eventId = parseInt(info.event.id);
                const detail = await getEventDetail(eventId);
                setEventDetail(detail);
                setConfirmed(detail.attendees.filter((x) => x.status === true));
                setPending(detail.attendees.filter((x) => x.status === false));
                setDetailDialogOpen(true);
              } catch (error) {
                console.error("Failed to fetch event detail:", error);
              }
            }}
            dateClick={handleDateClick}
          />
        </Grid>

        {/* CREATE EVENT MODAL */}
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedDate(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          {editMode ? (
            <DialogTitle>EDIT EVENT</DialogTitle>
          ) : (
            <DialogContent>CREATE EVENT</DialogContent>
          )}
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
            <Button
              onClick={() => {
                setOpenModal(false);
                setNewEvent({ title: "", content: "", start: "", end: "" });
                setSelectedUser([]);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddEvent}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* EVENT DETAIL DIALOG */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          fullWidth
          maxWidth="md"
          sx={{
            "& .MuiDialog-paper": {
              maxHeight: "90vh",
              minHeight: "50vh",
            },
          }}
        >
          {eventDetail && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderBottom: "1px solid #eee",
                backgroundColor: "#fafafa",
                borderRadius: "8px 8px 0 0",
              }}
            >
              {/* Bên trái: Action buttons hoặc Confirm status */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {eventDetail.creator.id === user?.id ? (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setNewEvent({
                          title: eventDetail.title,
                          content: eventDetail.content,
                          start: formatDate(eventDetail.startDate),
                          end: formatDate(eventDetail.endDate),
                        });
                        setSelectedUser(
                          eventDetail.attendees
                            ?.filter(
                              (u) => u.user_id !== eventDetail.creator.id
                            )
                            .map((u) => ({
                              user_id: u.user_id,
                              name: u.name,
                              avatar_url: u.avatar_url,
                              department_name: u.name,
                              email: u.email,
                              jobTitle: u.jobTitle,
                              role_dep: u.role_dep,
                            })) ?? []
                        );
                        setEditingEventId(eventDetail.id);
                        setEditMode(true);
                        setOpenModal(true);
                        setDetailDialogOpen(false);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={async () => {
                        if (
                          confirm("Are you sure you want to delete this event?")
                        ) {
                          try {
                            await deleteEvent(eventDetail.id);
                            toast.success("Event deleted successfully!");
                            setDetailDialogOpen(false);
                          } catch (error) {
                            toast.error("Failed to delete event!");
                            console.error(error);
                          }
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => setOpenReminderModal(true)}
                    >
                      ⏰ Create Reminder
                    </Button>
                  </>
                ) : (
                  <>
                    {!hasAccepted ? (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAcceptInvite(eventDetail.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeclineInvite(eventDetail.id)}
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography color="text.secondary" fontWeight="medium">
                          ✅ Accepted
                        </Typography>

                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => setOpenReminderModal(true)}
                        >
                          ⏰ Create Reminder
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Box>

              {/* Bên phải: Close button */}
              <Button variant="text" onClick={() => setDetailDialogOpen(false)}>
                Close
              </Button>
            </Box>
          )}
          <DialogContent>
            {eventDetail ? (
              <Grid container spacing={2}>
                {/* Cột trái - Nội dung chi tiết sự kiện */}
                <Grid size={{ xs: 12, md: 9 }}>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 3,
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      height: "100%",
                    }}
                  >
                    {/* Tiêu đề */}
                    <Typography variant="h5" fontWeight="bold">
                      🔥 {eventDetail.title}
                    </Typography>

                    {/* Thời gian */}
                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                      🕒 {formatDateLocal(eventDetail.startDate)} →{" "}
                      {formatDateLocal(eventDetail.endDate)}
                    </Typography>

                    <Divider />

                    {/* Nội dung */}
                    <Typography
                      whiteSpace="pre-line"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: 15,
                        color: "#333",
                      }}
                    >
                      {eventDetail.content || "No Content."}
                    </Typography>
                  </Box>
                </Grid>

                {/* Cột phải - Người tham gia */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    {/* Người tổ chức */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 1, color: "#333" }}
                      >
                        Creator
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          src={
                            eventDetail.creator.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              eventDetail.creator.name
                            )}&background=random`
                          }
                          sx={{ width: 36, height: 36 }}
                        />
                        <Box>
                          <Typography fontWeight="500" fontSize={14}>
                            {eventDetail.creator.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sent at{" "}
                            {formatDateLocal(eventDetail.startDate).replace(
                              "T",
                              " "
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Người đã chấp nhận */}
                    <Box>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={
                          showConfirmed ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )
                        }
                        onClick={() => setShowConfirmed((prev) => !prev)}
                        sx={{
                          textTransform: "none",
                          fontWeight: "bold",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        Confirmed ({confirmed.length})
                      </Button>

                      <Collapse in={showConfirmed} timeout="auto" unmountOnExit>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {confirmed.map((user) => (
                            <Grid size={{ xs: 12 }} key={user.user_id}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar
                                  src={
                                    user.avatar_url ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      user.name
                                    )}&background=random`
                                  }
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setSelectedUserDetail(user);
                                    setOpenUserModal(true);
                                  }}
                                />
                                <Typography variant="body2">
                                  {user.name}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Collapse>
                    </Box>

                    {/* Người chưa phản hồi */}
                    <Box>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={
                          showPending ? <ExpandLessIcon /> : <ExpandMoreIcon />
                        }
                        onClick={() => setShowPending((prev) => !prev)}
                        sx={{
                          textTransform: "none",
                          fontWeight: "bold",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        Pending ({pending.length})
                      </Button>

                      <Collapse in={showPending} timeout="auto" unmountOnExit>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {pending.map((user) => (
                            <Grid size={{ xs: 12 }} key={user.user_id}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar
                                  src={
                                    user.avatar_url ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      user.name
                                    )}&background=random`
                                  }
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setSelectedUserDetail(user);
                                    setOpenUserModal(true);
                                  }}
                                />
                                <Typography variant="body2">
                                  {user.name}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Collapse>
                    </Box>
                  </Box>
                </Grid>

                {/* Modal chi tiết người dùng */}
                {selectedUserDetail && (
                  <UserDetailModal
                    open={openUserModal}
                    onClose={() => setOpenUserModal(false)}
                    userData={{
                      id: selectedUserDetail.user_id,
                      name: selectedUserDetail.name,
                      email: selectedUserDetail.email,
                      avatarUrl: selectedUserDetail.avatar_url,
                      phone: "",
                      role: `${selectedUserDetail.role_dep} of ${selectedUserDetail.department_name}`,
                      jobTitle: selectedUserDetail.jobTitle ?? "",
                    }}
                  />
                )}
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={30} />
              </Box>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={openReminderModal}
          onClose={() => setOpenReminderModal(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>⏰ Create Reminder</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Chọn thời gian bạn muốn được nhắc trước khi sự kiện bắt đầu:
            </Typography>

            <Box display="flex" flexDirection="column" gap={1}>
              {[10, 30, 60, 120].map((m) => (
                <Button
                  key={m}
                  variant={selectedReminder === m ? "contained" : "outlined"}
                  onClick={() => setSelectedReminder(m)}
                >
                  {m >= 60 ? `${m / 60} giờ trước` : `${m} phút trước`}
                </Button>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReminderModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedReminder !== null) {
                  toast.success(
                    `Reminder set ${
                      selectedReminder >= 60
                        ? `${selectedReminder / 60} hours`
                        : `${selectedReminder} minutes`
                    } before event`
                  );
                  setOpenReminderModal(false);
                }
              }}
              disabled={!selectedReminder}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <ToastContainer></ToastContainer>
    </MainLayout>
  );
}
