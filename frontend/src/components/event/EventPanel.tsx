import React, { useState } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import EventCard from "./EventCard";
import EventDetailModal from "./EventDetailModal";
import type { EventResponseIPast } from "../../models/response/event.response";

interface Props {
  incomingEvents: EventResponseIPast[];
  pastEvents: EventResponseIPast[];
  loading: boolean;
}

const EventsPanel: React.FC<Props> = ({
  incomingEvents,
  pastEvents,
  loading,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventResponseIPast | null>(null);

  const handleOpenModal = (event: EventResponseIPast) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const renderEventSection = (
  title: string,
  events: EventResponseIPast[],
  emptyMessage: string
) => (
  <Box
    sx={{
      mb: 4,
      border: "1px solid #ccc",
      borderRadius: 3,
      p: 2,
      backgroundColor: "#f9f9f9",
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {loading ? (
      <CircularProgress size={24} />
    ) : events.length === 0 ? (
      <Box display="flex" alignItems="center" gap={1}>
        <EventBusyIcon color="disabled" />
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    ) : (
      <Box display="flex" flexDirection="column" gap={2}>
        {events.slice(0, 2).map((event) => (
          <Box
            key={event.id}
            onClick={() => handleOpenModal(event)}
            sx={{
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <EventCard event={event} />
          </Box>
        ))}
      </Box>
    )}
  </Box>
);


  return (
    <Grid size= {{xs:12, md: 4}}>

      {renderEventSection("INCOMINGS", incomingEvents, "No Events")}
      {renderEventSection("PAST", pastEvents, "No Events")}

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

export default EventsPanel