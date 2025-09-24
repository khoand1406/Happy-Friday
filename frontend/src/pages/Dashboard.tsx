import { Container, Typography, TextField, Card, CardMedia, CardContent, Button } from "@mui/material";
import Grid from '@mui/material/GridLegacy'; 
import { useState } from "react";
import type { Update } from "../interface/Mock";

export const DashboardPage = () => {
  const [search, setSearch] = useState('');

 

const mockUpdates: Update[] = [
  {
    id: 1,
    title: 'Project Alpha Reaches Milestone 2',
    description: 'We’ve achieved a major milestone in Project Alpha with new features released...',
    image: '/images/project1.jpg',
    date: '2025-09-24',
  },
  {
    id: 2,
    title: 'New Blog Post: Leadership Insights',
    description: 'Our team shares leadership lessons from the last sprint...',
    image: '/images/blog1.jpg',
    date: '2025-09-20',
  },
    {
    id: 3,
    title: 'New Blog Post: Leadership Insights',
    description: 'Our team shares leadership lessons from the last sprint...',
    image: '/images/blog1.jpg',
    date: '2025-09-20',
  },
{
    id: 4,
    title: 'New Blog Post: Leadership Insights',
    description: 'Our team shares leadership lessons from the last sprint...',
    image: '/images/blog1.jpg',
    date: '2025-09-20',
  },
{
    id: 5,
    title: 'New Blog Post: Leadership Insights',
    description: 'Our team shares leadership lessons from the last sprint...',
    image: '/images/blog1.jpg',
    date: '2025-09-20',
  },
{
    id: 6,
    title: 'New Blog Post: Leadership Insights',
    description: 'Our team shares leadership lessons from the last sprint...',
    image: '/images/blog1.jpg',
    date: '2025-09-20',
  },
{
    id: 7,
    title: 'New Blog Post: Leadership Insights',
    description: 'Our team shares leadership lessons from the last sprint...',
    image: '/images/blog1.jpg',
    date: '2025-09-20',
  },
];

  const filteredUpdates = mockUpdates.filter(u =>
    u.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Project Updates
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search updates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredUpdates.map(update => (
          <Grid item xs={12} sm={6} md={4} key={update.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
    </Container>
  );
};