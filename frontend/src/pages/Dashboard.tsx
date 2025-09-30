import {
  Container,
  Typography,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid
} from "@mui/material";
import { useState } from "react";
import type { Update } from "../props/Mock";
import MainLayout from "../layout/MainLayout";


export const DashboardPage = () => {
  const [search, setSearch] = useState("");

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
      description:
        "Our team shares leadership lessons from the last sprint...",
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

  const incomingEvents = [
    {
      id: 1,
      title: "Weekly Team Meeting",
      time: "2025-09-27 10:00 AM",
    },
    {
      id: 2,
      title: "Client Presentation",
      time: "2025-09-29 02:00 PM",
    },
  ];

  const filteredUpdates = mockUpdates.filter((u) =>
    u.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Ô search */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search updates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Grid chính chia 2 cột */}
        <Grid container spacing={3}>
          {/* Cột trái - Updates */}
          <Grid size= {{xs: 12, md: 8}}>

            {/* Grid con cho bài post */}
            <Grid container spacing={3}>
              {filteredUpdates.map((update) => (
                <Grid size= {{xs: 12, sm: 6}} key={update.id}>
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
                      <Button
                        size="small"
                        sx={{ mt: 2 }}
                        variant="outlined"
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Cột phải - Events */}
          <Grid size={{xs: 12, md: 4}}>
            <Typography variant="h5" gutterBottom>
              Incoming Events
            </Typography>
            {incomingEvents.map((event) => (
              <Card key={event.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.time}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};
