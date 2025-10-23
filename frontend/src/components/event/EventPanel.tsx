import React, { useState } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Button,
} from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import EventCard from "./EventCard";
import EventDetailModal from "./EventDetailModal"; // 👈 Import modal
import type { EventResponse } from "../../models/response/event.response";

interface Props {
  incomingEvents: EventResponse[];
  pastEvents: EventResponse[];
  loading: boolean;
}

const EventsPanel: React.FC<Props> = ({
  incomingEvents,
  pastEvents,
  loading,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null
  ); // 👈 Modal state

  const pageSize = 3;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const handleOpenModal = (event: EventResponse) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const events = tabIndex === 0 ? incomingEvents : pastEvents;
  const totalPages = Math.ceil(events.length / pageSize);
  const paginatedEvents = events.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Typography variant="h5" gutterBottom>
        Don't miss the hits
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="success" fullWidth>
          New Event
        </Button>
      </Box>

      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Sắp tới" />
        <Tab label="Đã qua" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : events.length === 0 ? (
          <Box display="flex" alignItems="center" gap={1}>
            <EventBusyIcon color="disabled" />
            <Typography variant="body2" color="text.secondary">
              {tabIndex === 0
                ? "Không có cuộc họp sắp tới."
                : "Không có cuộc họp đã qua."}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              mt: 1,
            }}
          >
            {paginatedEvents.map((event) => (
              <Box
                key={event.id}
                onClick={() => handleOpenModal(event)}
                sx={{ cursor: "pointer" }}
              >
                <EventCard event={event} />
              </Box>
            ))}

            {events.length > pageSize && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Older
                </Button>
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  Page {page + 1} / {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page === totalPages - 1}
                >
                  Newer
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* 👇 Modal hiển thị chi tiết sự kiện */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={Boolean(selectedEvent)}
          onClose={handleCloseModal}
        />
      )}
    </Grid>
  );
};

export default EventsPanel;
