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
} from "@mui/material";
import { AxiosError } from "axios";
import React from "react";
import { toast } from "react-toastify";
import type { UserProfileProps } from "../props/UserProps";

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
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => {
              setOpenEdit(true);
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenChangePass(true)}
          >
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
          {/* <Tab label="Activity" /> */}
        </Tabs>

        <CardContent>
          {tab === 0 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{email}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography>{phone}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography>{department_name}</Typography>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Grid container spacing={2}>
              {projects && projects.length > 0 ? (
                projects.map((proj) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={proj.project_id}>
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
                        sx={{ flexGrow: 1, mb: 1 }}
                      >
                        {proj.description || "No description available."}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: "auto",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "12px",
                            fontWeight: 500,
                            backgroundColor:
                              proj.status === "Active"
                                ? "rgba(34,197,94,0.2)"
                                : proj.status === "Completed"
                                ? "rgba(59,130,246,0.2)"
                                : "rgba(251,191,36,0.2)",
                            color:
                              proj.status === "Active"
                                ? "green"
                                : proj.status === "Completed"
                                ? "blue"
                                : "orange",
                          }}
                        >
                          {proj.status}
                        </Typography>

                        {/* User Role */}
                        <Typography variant="body2" fontWeight={500}>
                          {proj.project_role}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Currently not participating in any projects. Please inform
                    to your manager.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
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
              label="email"
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
