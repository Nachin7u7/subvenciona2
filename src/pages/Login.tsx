import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  Box,
  Button,
  CardContent,
  CardMedia,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import * as yup from "yup";
import { useFormik } from "formik";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useState } from "react";
import { setStorage } from "../helper/localStorage";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("No es un email valido")
    .required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const responseLogin = await login(values.email, values.password);
      if (!responseLogin) {
        setLoginError(true);
        formik.resetForm();
        return;
      }
      setStorage("token", responseLogin.token);
      setStorage("user", responseLogin);
      navigate("/app/dashboard", {
        replace: true,
      });
    },
  });

  return (
    <Container maxWidth="xs">
      <Toast
        open={loginError}
        message="Usuario Incorrecto"
        severity="error"
        onClose={() => setLoginError(false)}
      />
      <Box sx={{ marginY: 8 }}>
        <CardContent
          sx={{
            marginTop: 25,
            padding: 4,
            textAlign: "center",
            boxShadow: 3,
            paddingBottom: 12,
            borderRadius: 5
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image="src/assets/gasolinaYaLogo.png"
            sx={{ objectFit: 'contain' }}
            alt="green iguana"
          />
          {/* <img loading="lazy" src="gasolinaYaLogo.png" ></img> */}
          {/* <Typography
            sx={{ marginBottom: 2, fontWeight:'600', fontSize:'1.4rem', color:"#242424" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            Iniciar Sesión
          </Typography> */}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="input-email-textfield"
              label="Email"
              variant="filled"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} // <-- Add this
              value={formik.values.email}
              helperText={formik.touched.email && formik.errors.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              sx={{ marginBottom: 3, borderRadius: 10 }}
            />



            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: 1, borderRadius: 10 }}
              error={formik.touched.password && Boolean(formik.errors.password)}
            >
              <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
              <FilledInput
                id="filled-adornment-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.touched.password && formik.errors.password && (
                <Typography variant="caption" color="error">
                  {formik.errors.password}
                </Typography>
              )}
            </FormControl>


            <Button
              type="submit"
              //disabled={!(formik.dirty && formik.isValid)}
              sx={{
                marginTop: 2,
                width: "75%",
                height: '3rem',
                fontSize: '1rem',
                borderRadius: 20,
                backgroundColor: '#1E8BC3',
                fontWeight: '500quiero'

              }}
              variant="contained"
            >
              Iniciar Sesión
            </Button>
          </form>
          <Button
            onClick={() => navigate('/register')}
            sx={{
              marginTop: 2,
              width: "75%",
              height: '3rem',
              fontSize: '1rem',
              borderRadius: 20,
              color: '#1E8BC3',
              borderColor: '#1E8BC3',
              borderWidth: 2
            }}
            variant="outlined"
          >
            Crear Cuenta
          </Button>
        </CardContent>
      </Box>
    </Container>
  );
}

export default LoginPage;