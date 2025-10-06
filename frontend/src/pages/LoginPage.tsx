import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, AVATAR_URL, ROLE_ID } from "../constraint/LocalStorage";
import { authenticated } from "../services/auth.service";
import { ToastContainer } from "react-toastify";

export const LoginPage: React.FC = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate= useNavigate();
  
  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    // validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    
    try {
    const res = await authenticated({
      email,
      password,
    });

    if (res) {
      localStorage.clear();
      localStorage.setItem(ACCESS_TOKEN, res.access_token);
      localStorage.setItem(AVATAR_URL, res.user.avatar_url)
      localStorage.setItem(ROLE_ID, res.user?.role_id);
      const roleId = Number(res.user?.role_id);
      if (roleId === 1) { 
        navigate('/Admin/Dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setPasswordError("Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    setPasswordError("Login failed. Please try again.");
  }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f9f9f9",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "100%", sm: 400 },
          maxWidth: 450,
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Avatar
          alt="Company Logo"
          sx={{
            bgcolor: "primary.main",
            mb: 2,
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
          }}
          src="/assets/images/zen8labs_logo.jpeg"
        />

        <Typography
          variant="h5"
          sx={{
            mb: 0.5,
            fontWeight: "bold",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Zen8labs Portal
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "text.secondary",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
          }}
        >
          Sign in to your account
        </Typography>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* EMAIL */}
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            margin="normal"
            autoComplete="off"
            slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <EmailOutlinedIcon />
        </InputAdornment>
      ),
    },
  }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter your password"
            margin="normal"
            autoComplete="off"
            slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <LockOutlinedIcon></LockOutlinedIcon>
        </InputAdornment>
      ),
    },
  }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />

          <Box
            sx={{
              mt: 1,
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1,
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Remember me"
              sx={{ m: 0 }}
            />
            <Link
              href="#"
              variant="body2"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              bgcolor: "#0B0F19",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              py: 1.2,
              "&:hover": { bgcolor: "#1a1f2d" },
            }}
          >
            Sign In
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 3,
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            textAlign: "center",
          }}
        >
          Need help? <Link href="#">Contact IT Support</Link>
        </Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 3,
            color: "text.secondary",
            textAlign: "center",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
          }}
        >
          © 2025 Company Portal. All rights reserved.
        </Typography>
      </Paper>
    </Container>
    <ToastContainer autoClose= {2} position="top-right" pauseOnHover= {false} ></ToastContainer>
    </motion.div>
    
  );
};
