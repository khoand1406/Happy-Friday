import { useEffect } from "react";
import { supabaseClient } from "../config/SupabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseURl, OUTLOOK_LOGIN } from "../constraint/ApiConstraint";
import { ACCESS_TOKEN } from "../constraint/LocalStorage";
import { useUser } from "../context/UserContext";
import { Box, Avatar, Typography, CircularProgress } from "@mui/material";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;

          const email =
            user.email ||
            user.user_metadata?.email ||
            user.user_metadata?.preferred_username ||
            "unknown@outlook.com";

          const outlookAccessToken = session.provider_token;

          function formatNameFromEmail(email: string): string {
            const localPart = email.split("@")[0];
            return localPart
              .split(/[._]/)
              .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
              .join(" ");
          }

          // Tạo payload mặc định
          const payload: any = {
            id: user.id,
            email,
            name: user.user_metadata?.full_name || formatNameFromEmail(email),
            avatar_url:
              user.user_metadata?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.user_metadata?.full_name || formatNameFromEmail(email)
              )}`,
          };

          if (outlookAccessToken) {
            try {
              const graphRes = await fetch(
                "https://graph.microsoft.com/v1.0/me",
                {
                  headers: { Authorization: `Bearer ${outlookAccessToken}` },
                }
              );
              const profile = await graphRes.json();

              if (profile?.displayName) payload.name = profile.displayName;

              const photoRes = await fetch(
                "https://graph.microsoft.com/v1.0/me/photo/$value",
                { headers: { Authorization: `Bearer ${outlookAccessToken}` } }
              );

              if (photoRes.ok) {
                const blob = await photoRes.blob();
                payload.avatar_url = URL.createObjectURL(blob);
              } else {
                console.warn("⚠️ Không có avatar, dùng fallback.");
              }
            } catch (err) {
              console.warn(
                "⚠️ Không lấy được dữ liệu từ Microsoft Graph:",
                err
              );
            }
          }

          try {
            const res = await axios.post(
              `${BaseURl}${OUTLOOK_LOGIN}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (res.data?.token) {
              localStorage.setItem(ACCESS_TOKEN, res.data.token);
              setUser({
                id: res.data?.user.id,
                name: res.data?.user.name,
                email: res.data?.user.email,
                avatar_url: res.data?.user.avatar_url,
              });
              navigate("/dashboard");
            } else {
              console.warn("Backend không trả token:", res.data);
            }
          } catch (err: any) {
            console.error(
              "❌ Lỗi khi xác thực Outlook:",
              err.response?.data || err.message
            );
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out.");
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, [navigate, setUser]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Avatar
        sx={{ width: 80, height: 80, bgcolor: "#1976d2", mb: 2 }}
        src="https://ui-avatars.com/api/?name=Outlook&background=1976d2&color=fff"
      />
      <Typography variant="h6" gutterBottom>
        Đang xác thực tài khoản Outlook...
      </Typography>
      <CircularProgress color="primary" />
    </Box>
  );
}
