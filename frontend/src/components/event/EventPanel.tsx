import React, { useState } from 'react';
import {
  Grid,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Button
} from '@mui/material';

import EventCard from './EventCard';
import type { EventResponse } from '../../models/response/event.response';

interface Props {
  incomingEvents: EventResponse[];
  pastEvents: EventResponse[];
  loading: boolean;
}

const EventsPanel: React.FC<Props> = ({ incomingEvents, pastEvents, loading }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 3;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setPage(0); // reset page when switching tab
  };

  const events = tabIndex === 0 ? incomingEvents : pastEvents;
  const totalPages = Math.ceil(events.length / pageSize);
  const paginatedEvents = events.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <Grid size={{xs: 12, md: 4}}>
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
          <Typography variant="body2" color="text.secondary">
            {tabIndex === 0 ? 'Không có cuộc họp sắp tới.' : 'Không có cuộc họp đã qua.'}
          </Typography>
        ) : (
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              mt: 1,
            }}
          >
            {paginatedEvents.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}

            {events.length > pageSize && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Older
                </Button>
                <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                  Page {page + 1} / {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page === totalPages - 1}
                >
                  Newer
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default EventsPanel;
