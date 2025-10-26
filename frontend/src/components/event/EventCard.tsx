import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { EventResponse } from "../../models/response/event.response";

interface Props {
  event: EventResponse;
}

const EventCard: React.FC<Props> = ({ event }) => {
  // const timeRange = formatTimeRange(event.startdate, event.enddate);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "relative",
        p: 2,
      }}
    >
      {/* Nhãn ưu tiên và nút tùy chọn */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Chip
          label="Low"
          size="small"
          sx={{
            backgroundColor: "#f5e1c0",
            color: "#8a5c00",
            fontWeight: "bold",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Nội dung chính */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Brainstorming brings team members' diverse experience into play.
        </Typography>

        {/* Nhóm avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Avatar
              key={i}
              sx={{ width: 28, height: 28 }}
              src={`/avatars/avatar${i}.jpg`} // Thay bằng dữ liệu thực tế nếu có
            />
          ))}
        </Box>

        {/* Ngày giờ và lượt thích */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">Thứ 6, 06/10</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FavoriteBorderIcon fontSize="small" color="error" />
            <Typography variant="body2">8 thích</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default EventCard