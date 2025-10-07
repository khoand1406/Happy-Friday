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
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import MainLayout from "./MainLayout";

export default function CalendarLayout() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<any[]>([
    {
      title: "Team meeting",
      start: "2025-10-08T09:00:00",
      end: "2025-10-08T11:00:00",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      setEvents([...events, newEvent]);
      setOpenModal(false);
      setNewEvent({ title: "", start: "", end: "" });
    }
  };

  return (
    <MainLayout>
      <Grid container spacing={2} sx={{ height: "calc(100vh - 80px)", overflow: "hidden" }}>
      {/* SIDE CALENDAR */}
      <Grid
        size= {{xs: 3}}
       
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
        size= {{xs: 9}}
        
        sx={{
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#fafafa",
          p: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Work Schedule
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
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
            right: "timeGridWeek,timeGridDay",
          }}
          height="auto"
          events={events}
        />
      </Grid>

      {/* EVENT CREATION MODAL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            slotProps={{ inputLabel: {shrink: true}}}
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            slotProps={{ inputLabel: {shrink: true}}}
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEvent}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
    </MainLayout>
    
  );
}
