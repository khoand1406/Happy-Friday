import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EventsPanel from "../components/event/EventPanel";
import PostToolbar from "../components/toolbar/ToolBarComponent";
import { EventContext } from "../context/EventContext";
import MainLayout from "../layout/MainLayout";
import type { EventResponseIPast } from "../models/response/event.response";
import { getIncomingEvents, getPastEvents } from "../services/events.service";

interface Update {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  viewCount: number;
}

export const DashboardPage = () => {
  const [incomingEvents, setIncomingEvents] = useState<EventResponseIPast[]>([]);
  const [pastEvents, setPastEvents] = useState<EventResponseIPast[]>([]);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
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

  interface Template {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
  }
  const mockUpdates: Update[] = [
    {
      id: 1,
      title: "Project Alpha Reaches Milestone 2",
      description:
        "We’ve achieved a major milestone in Project Alpha with new features released...",
      image: "/assets/images/tech-group-meeting-flatlay.jpg",
      date: "2025-09-24",
      viewCount: 1800,
    },
    {
      id: 2,
      title: "New Blog Post: Leadership Insights",
      description: "Our team shares leadership lessons from the last sprint...",
      image: "/assets/images/powerful-woman-leaning-on-desk.jpg",
      date: "2025-09-20",
      viewCount: 540,
    },
    {
      id: 3,
      title: "Product Beta Testing Expanded",
      description:
        "The Beta phase is now open to 200+ new testers across all departments.",
      image: "/assets/images/software-development-planning-session.jpg",
      date: "2025-09-23",
      viewCount: 1200,
    },
    {
      id: 4,
      title: "HR Weekly Digest",
      description:
        "Catch up with the latest HR updates and employee success stories.",
      image: "/assets/images/software-development-planning-session.jpg",
      date: "2025-09-19",
      viewCount: 320,
    },
    {
      id: 5,
      title: "System Upgrade Notice",
      description:
        "Scheduled downtime on Sunday as we roll out infrastructure upgrades.",
      image: "/assets/images/artist-designer-at-work.jpg",
      date: "2025-09-25",
      viewCount: 950,
    },
  ];

  const templates: Template[] = [
    {
      id: 1,
      title: "Giới thiệu sản phẩm",
      description: "Template dành cho bài viết giới thiệu sản phẩm mới.",
      imageUrl: "/assets/images/thumbnail.png",
    },
    {
      id: 3,
      title: "Chia sẻ kiến thức",
      description: "Template dành cho bài viết chia sẻ kinh nghiệm, kiến thức.",
      imageUrl: "/assets/images/news.png",
    },
  ];

  // Sắp xếp theo viewCount giảm dần
  const sortedUpdates = [...mockUpdates].sort(
    (a, b) => b.viewCount - a.viewCount
  );
  const featured = sortedUpdates[0];
  const others = sortedUpdates.slice(1);

  function handleSelectTemplate(template: any): void {
    console.log(template);
  }

  return (
    <EventContext.Provider value={{ refreshEvents: fetchIncomingEvents }}>
      <MainLayout>
        <Container sx={{ mt: 0, mb: 4 }}>
          <PostToolbar onCreatePost={() => setOpenTemplateDialog(true)} />
          <Grid container spacing={3}>
            {/* LEFT COLUMN - Updates */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={3}>
                {/* Featured (big) card */}
                {featured && (
                  <Grid size={{ xs: 12 }}>
                    <Card
                      sx={{
                        position: "relative",
                        height: 350,
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
                          {featured.date} •{" "}
                          {featured.viewCount.toLocaleString()} views
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {featured.description}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mt: 2,
                            backgroundColor: "white",
                            color: "black",
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                )}

                {/* Others - smaller cards */}
                {others.map((update) => (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card
                      sx={{
                        height: 250,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={update.image}
                        alt={update.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {update.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {update.date} • {update.viewCount.toLocaleString()}{" "}
                          views
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {update.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                  Hot Topics
                </Typography>
                <Grid container spacing={3}>
                  {[
                    {
                      id: 1,
                      title:
                        "5 cách quản lý thời gian hiệu quả cho dân văn phòng",
                      description:
                        "Cùng khám phá những mẹo giúp tối ưu công việc và giảm stress hằng ngày.",
                      image: "/assets/images/thumbnail.png",
                      author: "Nguyễn Minh Khoa",
                      date: "2025-10-10",
                    },
                    {
                      id: 2,
                      title: "Hướng dẫn viết bài giới thiệu sản phẩm hấp dẫn",
                      description:
                        "Một bài viết sản phẩm hay có thể giúp bạn tăng gấp đôi lượng tương tác.",
                      image: "/assets/images/thumbnail.png",
                      author: "Lê Mai",
                      date: "2025-09-29",
                    },
                    {
                      id: 3,
                      title:
                        "Kỹ năng giao tiếp trong môi trường công sở hiện đại",
                      description:
                        "Những bí quyết giúp bạn tự tin hơn khi trao đổi và làm việc nhóm.",
                      image: "/assets/images/thumbnail.png",
                      author: "Trần Huy",
                      date: "2025-10-05",
                    },
                  ].map((article) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 3,
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "translateY(-6px)" },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="160"
                          image={article.image}
                          alt={article.title}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {article.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: "auto" }}
                          >
                            {article.author} • {article.date}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT COLUMN - Events */}
            <EventsPanel
              loading={loading}
              incomingEvents={incomingEvents}
              pastEvents={pastEvents}
            />

            <Dialog
              open={openTemplateDialog}
              onClose={() => setOpenTemplateDialog(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Select Template</DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  {templates.map((template) => (
                    <Grid size={{ xs: 12, sm: 6, md: 6 }} key={template.id}>
                      <Card
                        onClick={() => handleSelectTemplate(template)}
                        sx={{ cursor: "pointer" }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={template.imageUrl}
                          alt={template.title}
                        />
                        <CardContent>
                          <Typography variant="h6">{template.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
            </Dialog>
          </Grid>
        </Container>
      </MainLayout>
    </EventContext.Provider>
  );
};
