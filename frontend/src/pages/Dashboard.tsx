import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

import type { Update } from "../props/Mock";
import type { EventResponse } from "../models/response/event.response";
import { getIncomingEvents, getPastEvents } from "../services/events.service";
import EventsPanel from "../components/event/EventPanel";


export const DashboardPage = () => {
  const [incomingEvents, setIncomingEvents] = useState<EventResponse[]>([]);
  const [pastEvents, setPastEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastEvent = async () => {
      try {
        setLoading(true);
        const result = await getPastEvents();
        setPastEvents(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchIncomingEvent= async()=>{
      try {
        setLoading(true);
        const result= await getIncomingEvents();
        setIncomingEvents(result);
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false);
      }
    }
    fetchPastEvent();
    fetchIncomingEvent();
  }, []);

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
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" gutterBottom>
              Latest Updates
            </Typography>
            <Grid container spacing={3}>
              {mockUpdates.map((update) => (
                <Grid size={{ xs: 12, sm: 6 }} key={update.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
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

          <EventsPanel loading= {loading} incomingEvents={incomingEvents} pastEvents={pastEvents}></EventsPanel>
        </Grid>
      </Container>
    </MainLayout>
  );
};
