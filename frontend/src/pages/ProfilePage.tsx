import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getUserProfile, updateUserProfile } from "../services/user.service";
import { AVATAR_URL } from "../constraint/LocalStorage";
import { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import MainLayout from "../layout/MainLayout";
import { Box, Skeleton } from "@mui/material";
import UserProfile from "../components/UserProfile";


export const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  const getUserProfiles = async () => {
    try {
      const userResponse = await getUserProfile();
      if (userResponse) {
        setUser(userResponse); 
        localStorage.setItem(AVATAR_URL, userResponse.avatar_url ?? "");
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

  const updateSubmit = async (formData: FormData) => {
    const updated = await updateUserProfile(formData);
    if (updated) {
      setUser((prev) =>
        prev ? { ...prev, ...updated } : updated
      );
      localStorage.setItem(AVATAR_URL, updated.avatar_url ?? "");
    }
    return updated;
  };

  return (
    <MainLayout>
      {loading ? (
        <Box sx={{ p: 3 }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
        </Box>
      ) : user ? (
        <UserProfile
          {...user}
          email={user.email ?? ""}
          department_name={user.department_name?? ""}
          avatar_url={user.avatar_url?? ""}
          projects= {user.projects}
          updateSubmit={updateSubmit}

        />
      ) : (
        <p>No user profile found.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </MainLayout>
  );
};
