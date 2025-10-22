import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Box,
  Stack,
  Divider,
  Button,
  DialogActions,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Business, Email } from "@mui/icons-material";

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  userData: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarUrl: string;
  } | null;
}

const UserDetailModal = ({ open, onClose, userData }: UserDetailModalProps) => {
  if (!userData) return null;

  const { name, email, role, avatarUrl } = userData;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Thông tin người dùng
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center" py={2}>
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              width: 96,
              height: 96,
              mx: "auto",
              mb: 2,
              border: "3px solid #1976d2",
              boxShadow: "0 0 10px rgba(0,0,0,0.15)",
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {role || "Không có chức vụ"}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* 🔹 Thông tin chi tiết */}
        <Stack spacing={1.2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Email">
              <Email color="primary" fontSize="small" />
            </Tooltip>
            <Typography variant="body2">
              <strong>Email:</strong> {email || "Chưa có email"}
            </Typography>
          </Box>

        

          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Loại công việc">
              <Business color="primary" fontSize="small" />
            </Tooltip>
            <Typography variant="body2">
              <strong>Business type:</strong> {role || "Không xác định"}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      {/* 🔹 Action buttons */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Full Profile
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Actions
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModal;
