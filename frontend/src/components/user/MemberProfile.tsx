import { EmailOutlined, PhoneOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";
import type { MemberProfileProps } from "../../props/UserProps";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const MemberProfile: React.FC<MemberProfileProps> = ({
  name,
  email,
  phone,
  department_name,
  avatar_url,
  projects,
}) => {
  const [tab, setTab] = React.useState(0);

  const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`readonly-tabpanel-${index}`}
      aria-labelledby={`readonly-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* HEADER */}
      <Card sx={{ mb: 0, overflow: "visible" }}>
        <Box
          sx={{
            height: 120,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#E0F7FA" : "#004D40",
            position: "relative",
          }}
        />
        <CardContent sx={{ pt: 0, pb: 2, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transform: "translateY(-40px)",
              }}
            >
              <Avatar
                src={avatar_url}
                alt={name}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid white",
                  boxShadow: 3,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "4px",
                    fontWeight: 500,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    display: "inline-block",
                    mt: 0.5,
                  }}
                >
                  {department_name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* TABS */}
      <Card sx={{ mt: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
          variant="fullWidth"
        >
          <Tab label="Profile Info" />
          <Tab label={`Projects (${projects?.length || 0})`} />
        </Tabs>

        {/* PROFILE INFO */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={4}>
            <Grid size={{xs: 12, sm: 6}} >
              <Box display="flex" alignItems="center" mb={1}>
                <EmailOutlined color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" color="text.secondary">
                  Email
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ pl: 3 }}>
                {email}
              </Typography>
            </Grid>

            <Grid size={{xs: 12, sm: 6}}>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneOutlined color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" color="text.secondary">
                  Phone
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ pl: 3 }}>
                {phone || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>

        {/* PROJECTS */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={3}>
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <Grid size= {{xs: 12, sm: 6, md: 4}} key={proj.project_id}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {proj.project_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ flexGrow: 1, mb: 2 }}
                    >
                      {proj.description || "No description available."}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "16px",
                          fontWeight: 600,
                          backgroundColor:
                            proj.status === "Active"
                              ? "success.light"
                              : proj.status === "Completed"
                              ? "primary.light"
                              : "warning.light",
                          color:
                            proj.status === "Active"
                              ? "success.contrastText"
                              : proj.status === "Completed"
                              ? "primary.contrastText"
                              : "warning.contrastText",
                        }}
                      >
                        {proj.status}
                      </Typography>
                      <Typography variant="body2" fontWeight={500} color="text.primary">
                        {proj.project_role}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size= {{xs: 12}}>
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    This member is not currently in any projects.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default MemberProfile;
