import { createTheme } from "@mui/material/styles";

// Light Theme (logo nổi bật trên nền sáng)
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#064E3B" }, // xanh lá đậm thương hiệu
    secondary: { main: "#FACC15" }, // vàng thương hiệu
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#374151",
    },
  },
});

// Dark Theme (logo nổi bật trên nền tối)
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FACC15" }, // vàng làm điểm nhấn trên nền tối
    secondary: { main: "#10B981" }, // xanh ngọc nhẹ để bổ trợ
    background: {
      default: "#111827", // nền tổng thể
      paper: "#1E293B",   // card, app bar
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
    },
  },
});
