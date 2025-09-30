import { useEffect, useState } from "react";
import type { UserProfileResponse } from "../models/response/user.response";
import { getUserProfile } from "../services/user.service";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
import MainLayout from "../layout/MainLayout";
import UserProfile from "../components/UserProfile";
import { Box, Skeleton } from "@mui/material";

export const ProfilePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserProfiles = async () => {
    try {
      const userResponse = await getUserProfile();
      if (userResponse) {
        setCurrentUser(userResponse);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Unexpected Error Occurred. Try again");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfiles();
  }, []);

  return (
    <MainLayout>
    {loading ? (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
      </Box>
    ) : currentUser ? (
      <UserProfile {...currentUser} />
    ) : (
      <p>No user profile found.</p>
    )}
    <ToastContainer position="top-right" autoClose={3000} pauseOnHover= {true} />
  </MainLayout>
  
  );
};
