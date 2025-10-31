import { Toolbar, Button, Box, useMediaQuery, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";

interface PostToolbarProps {
  onCreatePost: () => void;
  onOpenSettings?: () => void;
}

const PostToolbar = ({ onCreatePost, onOpenSettings }: PostToolbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Toolbar
      disableGutters
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "stretch" : "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
        <IconButton onClick={onOpenSettings} color="default">
          <SettingsIcon />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onCreatePost}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Create
        </Button>
      </Box>
    </Toolbar>
  );
};

export default PostToolbar;
