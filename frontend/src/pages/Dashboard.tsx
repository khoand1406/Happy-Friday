import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import type { EventResponse } from "../models/response/event.response";
import { getIncomingEvents, getPastEvents } from "../services/events.service";
import EventsPanel from "../components/event/EventPanel";
import { EventContext } from "../context/EventContext";

interface Update {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  viewCount: number;
}

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

    fetchPastEvent();
    fetchIncomingEvents();
  }, []);

  const fetchIncomingEvents = async () => {
    try {
      setLoading(true);
      const result = await getIncomingEvents();
      setIncomingEvents(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const mockUpdates: Update[] = [
    {
      id: 1,
      title: "Project Alpha Reaches Milestone 2",
      description: "We’ve achieved a major milestone in Project Alpha with new features released...",
      image: "/images/project1.jpg",
      date: "2025-09-24",
      viewCount: 1800,
    },
    {
      id: 2,
      title: "New Blog Post: Leadership Insights",
      description: "Our team shares leadership lessons from the last sprint...",
      image: "/images/blog1.jpg",
      date: "2025-09-20",
      viewCount: 540,
    },
    {
      id: 3,
      title: "Product Beta Testing Expanded",
      description: "The Beta phase is now open to 200+ new testers across all departments.",
      image: "/images/project2.jpg",
      date: "2025-09-23",
      viewCount: 1200,
    },
    {
      id: 4,
      title: "HR Weekly Digest",
      description: "Catch up with the latest HR updates and employee success stories.",
      image: "/images/blog2.jpg",
      date: "2025-09-19",
      viewCount: 320,
    },
    {
      id: 5,
      title: "System Upgrade Notice",
      description: "Scheduled downtime on Sunday as we roll out infrastructure upgrades.",
      image: "/images/system.jpg",
      date: "2025-09-25",
      viewCount: 950,
    },
  ];

  // Sắp xếp theo viewCount giảm dần
  const sortedUpdates = [...mockUpdates].sort((a, b) => b.viewCount - a.viewCount);
  const featured = sortedUpdates[0];
  const others = sortedUpdates.slice(1);

  return (
    <EventContext.Provider value={{ refreshEvents: fetchIncomingEvents }}>
      <MainLayout>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* LEFT COLUMN - Updates */}
            <Grid size= {{xs:12, md: 8}}>
              <Grid container spacing={3}>
                {/* Featured (big) card */}
                {featured && (
                  <Grid size= {{xs: 12}}>
                    <Card
                      sx={{
                        position: "relative",
                        height: 320,
                        overflow: "hidden",
                        borderRadius: 2,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={featured.image}
                        alt={featured.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.7)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 3,
                          color: "white",
                          background:
                            "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.8) 100%)",
                        }}
                      >
                        <Typography variant="h5" fontWeight={600}>
                          {featured.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {featured.date} • {featured.viewCount.toLocaleString()} views
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {featured.description}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ mt: 2, backgroundColor: "white", color: "black" }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                )}

                {/* Others - smaller cards */}
                {others.map((update) => (
                  <Grid size= {{xs: 12, sm: 6}}>
                    <Card
                      sx={{
                        height: 200,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="100"
                        image={update.image}
                        alt={update.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {update.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {update.date} • {update.viewCount.toLocaleString()} views
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {update.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* RIGHT COLUMN - Events */}
            <EventsPanel
              loading={loading}
              incomingEvents={incomingEvents}
              pastEvents={pastEvents}
            />
          </Grid>
        </Container>
      </MainLayout>
    </EventContext.Provider>
  );
};
