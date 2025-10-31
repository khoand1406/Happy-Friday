import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { EventResponseIPast } from "../../models/response/event.response";

interface Props {
  event: EventResponseIPast;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const { participants } = event;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        position: "relative",
        p: 2.5,
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
       
      {/* Nút tùy chọn góc phải */}
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Nội dung chính */}
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        <Typography variant="h6" fontWeight={600}>
           {event.title?.trim() || "No title"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {event.content?.trim() || "No content"}
        </Typography>

        {/* Danh sách người tham gia */}
        {participants?.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Box sx={{ display: "flex" }}>
              {participants.slice(0, 4).map((p, index) => (
                <Tooltip key={p.id} title={p.name} arrow>
                  <Avatar
                    src={
                      p.avatar ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        p.name
                      )}&background=random`
                    }
                    sx={{
                      width: 30,
                      height: 30,
                      border: "2px solid white",
                      ml: index > 0 ? -1 : 0,
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
            {participants.length > 4 && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                +{participants.length - 4} more
              </Typography>
            )}
          </Box>
        )}

        {/* Thời gian và lượt thích */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Thứ 6, 31/10
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FavoriteBorderIcon fontSize="small" color="error" />
            <Typography variant="body2" color="text.secondary">
              {event.participants.length} follows
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
};

export default EventCard;
