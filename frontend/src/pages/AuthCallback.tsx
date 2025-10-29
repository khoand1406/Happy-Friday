import { useEffect } from "react";
import { supabaseClient } from "../config/SupabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseURl, OUTLOOK_LOGIN } from "../constraint/ApiConstraint";
import { ACCESS_TOKEN } from "../constraint/LocalStorage";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;
          console.log("✅ User signed in:", user);

          const email =
            user.email ||
            user.user_metadata?.email ||
            user.user_metadata?.preferred_username ||
            "unknown@outlook.com";

          // ✅ Token Microsoft Graph do Supabase cấp lại
          // const outlookAccessToken = session.provider_token;

          function formatNameFromEmail(email: string): string {
            const localPart = email.split("@")[0]; // "khoa.nguyen"
            return localPart
              .split(".")
              .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
              .join(" "); // => "Khoa Nguyen"
          }

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

          // ✅ Nếu có token Microsoft thì gọi Graph API để lấy thông tin thật
          // if (outlookAccessToken) {
          //   try {
          //     console.log("🔐 Microsoft Graph token:", outlookAccessToken);
          //     const graphRes = await fetch("https://graph.microsoft.com/v1.0/me", {
          //       headers: { Authorization: `Bearer ${outlookAccessToken}` },
          //     });
          //     const profile = await graphRes.json();

          //     if (profile?.displayName) payload.name = profile.displayName;

          //     const photoRes = await fetch(
          //       "https://graph.microsoft.com/v1.0/me/photo/$value",
          //       {
          //         headers: { Authorization: `Bearer ${outlookAccessToken}` },
          //       }
          //     );

          //     if (photoRes.ok) {
          //       const blob = await photoRes.blob();
          //       payload.avatar_url = URL.createObjectURL(blob);
          //     }
          //   } catch (err) {
          //     console.warn("⚠️ Không lấy được avatar từ Microsoft Graph:", err);
          //   }
          // }

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

              navigate("/dashboard");
            } else {
              console.warn("⚠️ Backend không trả token:", res.data);
            }
          } catch (err: any) {
            console.error(
              "❌ Lỗi khi xác thực Outlook:",
              err.response?.data || err.message
            );
          }
        } else if (event === "SIGNED_OUT") {
          console.log("👋 User signed out.");
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  return <div>Đang xác thực tài khoản Outlook...</div>;
}
