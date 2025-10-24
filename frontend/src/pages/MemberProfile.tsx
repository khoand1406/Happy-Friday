import { Box, Skeleton } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MainLayout from "../layout/MainLayout";

import type { UserProfileResponse } from "../models/response/user.response";
import { getMemberInfo } from "../services/user.service";
import MemberProfile from "../components/user/MemberProfile";

export const ProfileUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);

  const fetchUserProfile = async () => {
    if (!userId) return;
    try {
      const response = await getMemberInfo(userId);
      setUserProfile(response);
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
    fetchUserProfile();
  }, [userId]);

  return (
    <MainLayout>
      {loading ? (
        <Box sx={{ p: 3 }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
        </Box>
      ) : userProfile ? (
        <MemberProfile
          {...userProfile}
          email={userProfile.email ?? ""}
          department_name={userProfile.department_name ?? ""}
          avatar_url={userProfile.avatar_url ?? ""}
          projects={userProfile.projects}
          
          
        />
      ) : (
        <p>No user profile found.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </MainLayout>
  );
};
