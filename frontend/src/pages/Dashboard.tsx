import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState } from "react";
import MainLayout from "../layout/MainLayout";

import type { Update } from "../props/Mock";
import type { EventResponse } from "../models/response/event.response";

export const DashboardPage = () => {
  const [incomingEvents] = useState<EventResponse[]>([]);
  const [pastEvents] = useState<EventResponse[]>([]);
  const [loading] = useState(true);

  const mockUpdates: Update[] = [
    {
      id: 1,
      title: "Project Alpha Reaches Milestone 2",
      description:
        "We’ve achieved a major milestone in Project Alpha with new features released...",
      image: "/images/project1.jpg",
      date: "2025-09-24",
    },
    {
      id: 2,
      title: "New Blog Post: Leadership Insights",
      description: "Our team shares leadership lessons from the last sprint...",
      image: "/images/blog1.jpg",
      date: "2025-09-20",
    },
    {
      id: 3,
      title: "Another Blog Post",
      description:
        "We keep improving leadership lessons from the last sprint...",
      image: "/images/blog1.jpg",
      date: "2025-09-22",
    },
  ];

  

  return (
    <MainLayout>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Cột trái - Updates */}
          <Grid size= {{xs: 12, md: 8}}>
            <Typography variant="h5" gutterBottom>
              Latest Updates
            </Typography>
            <Grid container spacing={3}>
              {mockUpdates.map((update) => (
                <Grid size= {{xs:12, sm: 6}} key={update.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={update.image}
                      alt={update.title}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {update.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {update.date}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {update.description}
                      </Typography>
                      <Button size="small" sx={{ mt: 2 }} variant="outlined">
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Cột phải - Events */}
          <Grid size= {{xs:12, md: 4}}>
            <Typography variant="h5" gutterBottom>
              Incoming Events
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : incomingEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No upcoming events.
              </Typography>
            ) : (
              incomingEvents.map((event) => (
                <Card key={event.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.startdate).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Past Events
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : pastEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No past events.
              </Typography>
            ) : (
              pastEvents.map((event) => (
                <Card key={event.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.startdate).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};
