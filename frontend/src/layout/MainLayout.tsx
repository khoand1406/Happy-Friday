import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PeopleIcon from "@mui/icons-material/People";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../components/common/SearchComponent";
import { AVATAR_URL } from "../constraint/LocalStorage";
import { useUser } from "../context/UserContext";
import { darkTheme, lightTheme } from "../theme/theme";
import { getNotifications } from "../services/notification.service";
import type { NotificationResponse } from "../models/response/notification.response";
import type { ProjectResponse } from "../models/response/project.response";
import { getProjectsByUserId } from "../services/project.service";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
  children: React.ReactNode;
  showDrawer?: boolean;
}

export default function MainLayout({
  window,
  children,
  showDrawer = true,
}: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [darkMode] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElNotifications, setanchorNotificationEl] =
    React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<
    NotificationResponse[]
  >([]);
  const [openNotifications, setOpenNotifications] = React.useState(false);
  const [projects, setProjects] = React.useState<ProjectResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const location = useLocation();
  const localAvatar = localStorage.getItem(AVATAR_URL);
  const { user } = useUser();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    handleClose();
  };

  const handleClickNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setanchorNotificationEl(event.currentTarget);
    setOpenNotifications(true);
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Members", icon: <PeopleIcon />, path: "/members" },
    {
      text: "Calendar",
      icon: <CalendarMonthOutlinedIcon />,
      path: "/calendar",
    },
    { text: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
  ];

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    if (openNotifications) {
      fetchNotifications();

      intervalId = setInterval(fetchNotifications, 30000);
    }

    return () => {
      if (intervalId)
        clearInterval(intervalId as ReturnType<typeof setInterval>);
    };
  }, [openNotifications]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjectsByUserId();
        setProjects(data);
      } catch (error) {
        console.error("❌ Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const drawer = (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}
    >
      <Box display="flex" alignItems="center" p={2} gap={1}>
        <img
          src="/assets/images/logo-layout.png"
          alt="logo"
          style={{ height: 32, borderRadius: 6 }}
        />
      </Box>
      <Divider />
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  backgroundColor: active ? "action.selected" : "transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: active ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider></Divider>
       <Divider sx={{ my: 1 }} />

      {/* --- Project list --- */}
      <Typography
        variant="subtitle2"
        sx={{ pl: 2, mt: 1, mb: 0.5, color: "text.secondary" }}
      >
        My Projects
      </Typography>

      <List sx={{ mb: 1 }}>
        {loading ? (
          <Typography
            variant="body2"
            sx={{ pl: 3, py: 1, color: "text.disabled", fontStyle: "italic" }}
          >
            Loading...
          </Typography>
        ) : projects.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ pl: 3, py: 1, color: "text.disabled", fontStyle: "italic" }}
          >
            No projects yet
          </Typography>
        ) : (
          projects.map((item) => (
            <ListItem key={item.project_id} disablePadding>
              <ListItemButton
                onClick={() => navigate(`/project-detail/${item.project_id}`)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  "&:hover": { backgroundColor: "action.hover" },
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WorkOutlineIcon fontSize="small" color="action" />
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  />
                </div>

                <Chip
                  label={item.current_role}
                  size="small"
                  color={
                    item.current_role === "Leader"
                      ? "primary"
                      : item.current_role === "Member"
                      ? "secondary"
                      : "default"
                  }
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 500,
                    fontSize: 11,
                    height: 22,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
      <Box flexGrow={1} />
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex", bgcolor: "#f9fafc" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#fff",
            color: "#111",
            borderBottom: "1px solid #e5e7eb",
            px: 2,
          }}
        >
          <Toolbar>
            {/* Hamburger menu (hiện ở mobile) */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* 🟡 Logo Zen8 Portal */}
            <Box
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/dashboard")}
            >
              <img
                src="/assets/images/logo-layout.png"
                alt="Zen8Labs Logo"
                style={{ height: 36, marginRight: 8, borderRadius: 8 }}
              />
            </Box>

            {/* Thanh tìm kiếm */}
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <Search sx={{ maxWidth: 400 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search everything..."
                  inputProps={{ "aria-label": "search" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim() !== "") {
                      navigate(
                        `/search?q=${encodeURIComponent(search.trim())}`
                      );
                      setSearch("");
                    }
                  }}
                />
              </Search>
            </Box>
            <IconButton onClick={handleClickNotifications}>
              <Badge
                badgeContent={notifications.filter((n) => !n.is_read).length}
                color="error"
              >
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <IconButton size="large" color="inherit" sx={{ color: "#555" }}>
              <CalendarMonthOutlinedIcon />
            </IconButton>

            <IconButton size="large" color="inherit" sx={{ color: "#555" }}>
              <QuestionAnswerOutlinedIcon />
            </IconButton>

            <IconButton onClick={handleClick} sx={{ ml: 2 }}>
              <Avatar alt="User" src={user?.avatar_url || localAvatar || ""} />
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1.5,
                  width: 260,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={user?.avatar_url || localAvatar || ""}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography fontWeight={600}>
                      {user?.name || "Your name"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || "yourname@gmail.com"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box>
                  <ListItemButton onClick={handleProfile}>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </ListItemButton>

                  <ListItemButton>
                    <ListItemIcon>
                      <SettingsOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>

                  <ListItemButton>
                    <ListItemIcon>
                      <NotificationsNoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Notification" />
                  </ListItemButton>

                  <Divider sx={{ my: 1 }} />

                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutOutlinedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Log Out"
                      primaryTypographyProps={{ color: "error" }}
                    />
                  </ListItemButton>
                </Box>
              </Paper>
            </Popover>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        {showDrawer && (
          <Drawer
            container={container}
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                borderRight: "1px solid #e5e7eb",
                boxSizing: "border-box",
                backgroundColor: "#fff",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            mt: 8,
            ml: { sm: showDrawer ? `${drawerWidth}px` : 0 },
            width: {
              sm: showDrawer ? `calc(100% - ${drawerWidth}px)` : "100%",
            },
            minHeight: "100vh",
            backgroundColor: "#f9fafc",
          }}
        >
          {children}
        </Box>
      </Box>
      <Popover
        open={openNotifications}
        anchorEl={anchorElNotifications}
        onClose={handleCloseNotifications}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h6">Notifications</Typography>
          <Divider sx={{ my: 1 }} />
          {notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          ) : (
            notifications.map((n) => (
              <Box key={n.id} sx={{ mb: 1 }}>
                <Typography fontWeight={n.is_read ? 400 : 600}>
                  {n.title}
                </Typography>
                <Typography variant="body2">{n.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.created_at).toLocaleString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Popover>
    </ThemeProvider>
  );
}
