import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import type { EventResponse } from "../../models/response/event.response";
import { formatDateParts, formatTimeRange } from "../../utils/DateFormat";


interface Props {
  event: EventResponse;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const { day, month } = formatDateParts(event.startdate);
  const timeRange = formatTimeRange(event.startdate, event.enddate);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Ngày và tháng */}
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                backgroundColor: "#dfebe1dc",
                color: "white",
                textAlign: "center",
                borderRadius: 1,
                py: 1,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {day}
              </Typography>
              <Typography variant="body2">{month}</Typography>
            </Box>
          </Grid>

          {/* Tiêu đề và giờ */}
          <Grid size={{ xs: 9 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {timeRange}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EventCard;
