import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getEventDetail } from "../../services/events.service";
import type {
  EventDetailResponse,
  EventResponseIPast,
} from "../../models/response/event.response";
import { formatDateParts } from "../../utils/DateFormat";

interface Props {
  event: EventResponseIPast;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const [eventDetail, setEventDetail] = useState<EventDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchDetailEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventDetail(event.id);
        setEventDetail(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailEvent();
  }, [event.id, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : eventDetail ? (
          <Box sx={{ display: "flex",alignItems: "flex-start", gap: 2 }}>
            {/* Ngày / Tháng hiển thị nổi bật */}
            <Box
              sx={{
                minWidth: 56,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {(() => {
                const { day, month } = formatDateParts(eventDetail.startDate);
                return (
                  <>
                    <Typography variant="h6" fontWeight="bold" lineHeight={1}>
                      {day}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ textTransform: "uppercase", lineHeight: 1 }}
                    >
                      {month}
                    </Typography>
                  </>
                );
              })()}
            </Box>

            {/* Nội dung sự kiện */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {eventDetail.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created By: {eventDetail.creator.name}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">{eventDetail.content}</Typography>
              </Box>
              
            </Box>
          </Box>
        ) : (
          <Typography>No Event Infomation Founded.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailModal;
