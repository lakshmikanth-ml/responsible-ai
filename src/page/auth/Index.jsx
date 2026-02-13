import React, { use } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { login } from "../../redux/apiCall/auth";
import { loginSuccess } from "../../redux/slices/auth";
// -------------------------
// Yup Validation Schema
// -------------------------
const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required."),
  password: yup.string().required("Password is required."),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);

  const redirectTo = location.state?.from?.pathname || "/app/transparencyexplainability";

  // -------------------------
  // useFormik Setup
  // -------------------------
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {

      dispatch(loginSuccess({
        user: { id: 1, name: "Demo User",
           email: values.email, role: "admin" },
        token: "demo-token",
      }))
      navigate('/app/fairnessandondiscrimination/', { replace: true })

    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={1}>
          Welcome Back
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to continue
        </Typography>

        {/* ------------------------- */}
        {/* Formik Form */}
        {/* ------------------------- */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Email*"
            name="email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Password*"
            type="password"
            name="password"
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            size="large"
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Typography
            variant="body2"
            sx={{ cursor: "pointer", color: "primary.main", display: "none" }}
          >
            Forgot Password?
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
