import { useState} from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  type Theme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type { layoutProps } from "../props/LayoutProp";


export const MainLayout: React.FC<layoutProps> = ({ children }) => {
  const drawerWidth = 240;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {["Dashboard", "Members", "Departments", "Projects"].map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <ListItemText primary={item}></ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      <AppBar position="fixed" sx={{ width: "100%", bgcolor: "primary.main" }}>
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              aria-label="Open Drawer"
              edge="start"
              onClick={handleMobileToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Zen8Labs' Portal Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              top: 64, // 64px = height của AppBar mặc định
              height: "calc(100% - 64px)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}

      
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={isMobileOpen}
          onClose={handleMobileToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              top: 64,
              height: "calc(100% - 64px)",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          mt: "64px",
          ml: isDesktop ? 0 : 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
        <Box
          component="footer"
          sx={{
            py: 2,
            textAlign: "center",
            bgcolor: "#f5f5f5",
            mt: "auto",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Company Portal. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
