import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { EmailOutlined, PhoneOutlined, LockOutlined } from "@mui/icons-material";
import { AxiosError } from "axios";
import React from "react";
import { toast } from "react-toastify";
import type { UserProfileProps } from "../props/UserProps";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  phone,
  department_name,
  avatar_url,
  projects,
  updateSubmit,
  changePassword,
}) => {
  const [tab, setTab] = React.useState(0);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openChangePass, setOpenChangePass] = React.useState(false);
  const [formName, setFormName] = React.useState(name);
  const [formPhone, setFormPhone] = React.useState(phone);
  const [formAvatar, setFormAvatar] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(avatar_url);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingPass, setLoadingPass] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", formName);
    formData.append("phone", formPhone);
    if (formAvatar) formData.append("avatar_url", formAvatar);

    try {
      setLoading(true);
      await updateSubmit(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg =
          error.response?.data?.message || error.message || "Update failed!";
        toast.error(msg);
      } else {
        toast.error("Unexpected Error: " + String(error));
      }
    } finally {
      setLoading(false);
      setOpenEdit(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoadingPass(true);
      await changePassword({
        email,
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully!");
      setOpenChangePass(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data;

        if (Array.isArray(data?.message)) {
          toast.error(data.message.join("\n"));
        } else {
          toast.error(data?.message || error.message || "Something went wrong");
        }
      } else {
        toast.error("Unexpected Error: " + String(error));
      }
    } finally {
      setLoadingPass(false);
    }
  };

  const TabPanel: React.FC<TabPanelProps>= ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      
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

            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenEdit(true);
                }}
                sx={{ mr: 1 }}
              >
                Edit Profile
              </Button>
              <IconButton
                color="error"
                title="Change Password"
                onClick={() => setOpenChangePass(true)}
              >
                <LockOutlined />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      
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

        
        <TabPanel value={tab} index={0}>
          <Grid container spacing={4}>
            {/* Email */}
            <Grid size= {{xs:12, sm: 6}}>
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
            {/* Phone */}
            <Grid size={{ xs: 12, sm: 6 }}>
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
                        pt: 1, // Add padding top for separation
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
                  sx={{ p: 4, textAlign: "center", bgcolor: "grey.50", borderRadius: 1 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Currently not participating in any projects.
                  </Typography>
                  <Typography variant="caption" color="text.hint">
                    Please inform your manager if this is incorrect.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Card>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
            <Button variant="outlined" component="label">
              Upload Avatar
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {preview && (
              <Avatar
                src={preview}
                alt="Preview"
                sx={{ width: 80, height: 80, mt: 1 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openChangePass}
        onClose={() => setOpenChangePass(false)}
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              disabled
            ></TextField>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePass(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleChangePassword}
            disabled={loadingPass}
          >
            {loadingPass ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;