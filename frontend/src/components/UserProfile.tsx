import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
  TextField,
} from "@mui/material";
import type { UserProfileProps } from "../props/UserProps";

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  phone,
  department_name,
  avatar_url,
  projects,
}) => {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Card sx={{ mb: 3, p: 3, textAlign: "center" }}>
        <Avatar
          src={avatar_url}
          alt={name}
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {department_name}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" sx={{ mr: 2 }}>
            Edit Profile
          </Button>
          <Button variant="outlined" color="error">
            Change Password
          </Button>
        </Box>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Profile Info" />
          <Tab label="Projects" />
          <Tab label="Activity" />
        </Tabs>

        <CardContent>
          {/* Profile Info */}
          {tab === 0 && (
            <Grid container spacing={2}>
              <Grid size= {{xs:12, sm:6}}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{email}</Typography>
              </Grid>
              <Grid size= {{xs:12, sm:6}}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography>{phone}</Typography>
              </Grid>
              <Grid size= {{xs:12, sm:6}}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography>{department_name}</Typography>
              </Grid>
              
            </Grid>
          )}

          {/* Projects */}
          {tab === 1 && (
            <Grid container spacing={2}>
              {projects.map((proj) => (
                <Grid size= {{xs:12, sm:6}} key={proj.project_id}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{proj.project_name}</Typography>
                    
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Activity */}
          

           {tab === 2 && (
            <Box component="form" sx={{ maxWidth: 400 }}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
