import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../components/SearchComponent";
import { ACCESS_TOKEN, AVATAR_URL } from "../constraint/LocalStorage";
import { useUser } from "../context/UserContext";
import { darkTheme, lightTheme } from "../theme/theme";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
  children: React.ReactNode;
}

export default function MainLayout(props: Props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleThemeToggle = () => setDarkMode(!darkMode);

  // User menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const localAvatar= localStorage.getItem(AVATAR_URL);
  const {user}= useUser();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = ()=>{
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login");
    handleClose();
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Members & Departments", icon: <PeopleIcon />, path: "/members" },
    { text: "Projects", icon: <WorkIcon />, path: "/projects" },
  ];

  const drawer = (
    <Box sx={{ height: "100%" }}>
      <img
        src="/assets/images/zen8labs_logo.jpeg"
        alt="Zen8Labs Logo"
        style={{ height: 40, marginRight: 8 }}
      />
      <Divider />
      <List>
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
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {/* Hamburger */}
            <img
              src="/assets/images/logo-layout.png"
              alt="Zen8Labs Logo"
              style={{ height: 40, marginRight: 8 }}
            />
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="false"
              />
            </Search>
            {/* Theme Switch */}
            <Switch checked={darkMode} onChange={handleThemeToggle} />

            {/* User */}
            <IconButton onClick={handleClick} sx={{ ml: 2 }}>
              <Avatar alt="User" src={user?.avatar_url || localAvatar || ""} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
