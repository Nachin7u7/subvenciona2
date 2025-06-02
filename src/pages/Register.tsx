import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, CardContent, CardMedia, Container, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import GasStationForm from "../components/GasStationForm";
import ClientForm from "../components/ClientForm";
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import type { RegisterCustomerRequest, RegisterGasStationRequest, RegisterUserRequest } from "../services/models/authModels";
import { array, boolean, date, number, object, string } from "yup";


const dayschema = object({
  day: string().required()
})
const schema = object({
  email: string().email().required(),
  password: string().min(6).required(),
  confirmPassword: string().min(6).required(),
  name: string().min(1).max(24).required(),
  lastname: string().min(1).max(24).required(),
  admin_role: boolean().required(),
  // aca empiza el customer
  license: string().required().min(6),
  carPlate: string().min(6).max(7).optional(),
  // aca empieza el gasStation
  gasSatationName: string().min(6).max(25).optional(),
  address: string().min(1).max(24).optional(),
  openTime: date(),
  closeTime: date(),
  open: boolean().optional(),
  zone: number().positive().optional(), 
  serviceDays: array().of(dayschema).optional()
})

function RegisterPage() {
  const [modoAdminCreate, setModoAdminCreate] = useState(false);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newModoAdmin: boolean,
  ) => {
    setModoAdminCreate(newModoAdmin);
  };

  const [user, setUser] = useState<RegisterUserRequest>();
  const [client, setClient] = useState<RegisterCustomerRequest>();
  const [gasStation, setGasStation] = useState<RegisterGasStationRequest>();


  const children = [
    <ToggleButton value={false} key="Cliente" sx={{display:"flex",flexDirection:'column'}}>
      <PersonIcon sx={{height:50,width:50}}/>
      <Typography
        sx={{width:110, fontWeight: '600', fontSize: '1rem', color: !modoAdminCreate?"#242424":"#757575" }}
        variant="h5"
        component="h5"
      >
        Cliente
      </Typography>
    </ToggleButton>,

    <ToggleButton value={true} key="Gasolinera" sx={{display:"flex",flexDirection:'column'}}>
      <LocalGasStationIcon sx={{height:50,width:50}}/>
      <Typography
        sx={{width:110, fontWeight: '600', fontSize: '1rem', color: modoAdminCreate?"#242424":"#757575" }}
        variant="h5"
        component="h5"
      >
        Gasolinera
      </Typography>

    </ToggleButton>,
  ];

  const control = {
    value: modoAdminCreate,
    onChange: handleChange,
    exclusive: true,
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth='xs' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
      <Box sx={{ marginY: 8, width: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <CardContent
          sx={{
            marginTop: 25,
            padding: 4,
            textAlign: "center",
            boxShadow: 3,
            paddingBottom: 12,
            borderRadius: 5,
            width: 1000
          }}>
          <div style={{ display: 'flex', marginBottom: 2, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <CardMedia
              component="img"
              height="100"
              image="src/assets/gasolinaYaLogo.png"
              sx={{ objectFit: 'contain', width: 80, marginX: 1 }}
              alt="green iguana"
            />
            <Typography
              sx={{ fontWeight: '600', fontSize: '1.8rem', color: "#242424" }}
              variant="h5"
              component="h1"
              gutterBottom
            >
              Crear Cuenta
            </Typography>
          </div>
          <Grid container spacing={3} sx={{ marginTop: 2, width: '100%' }}>
            <Grid size={6}>
              <TextField
                fullWidth
                id="input-name-textfield"
                label="Nombre(s)"
                variant="filled"
                name="name"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur} // <-- Add this
                // value={formik.values.email}
                // helperText={formik.touched.email && formik.errors.email}
                // error={formik.touched.email && Boolean(formik.errors.email)}
                sx={{ marginBottom: 0, borderRadius: 10 }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                id="input-lastname-textfield"
                label="Apellidos"
                variant="filled"
                name="lastname"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur} // <-- Add this
                // value={formik.values.email}
                // helperText={formik.touched.email && formik.errors.email}
                // error={formik.touched.email && Boolean(formik.errors.email)}
                sx={{ marginBottom: 0, borderRadius: 10 }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                id="input-name-textfield"
                label="Correo electrónico"
                variant="filled"
                name="email"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur} // <-- Add this
                // value={formik.values.email}
                // helperText={formik.touched.email && formik.errors.email}
                // error={formik.touched.email && Boolean(formik.errors.email)}
                sx={{ marginBottom: 0, borderRadius: 10 }}
              />
            </Grid>
            <Grid size={6}>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ marginBottom: 1, borderRadius: 10 }}
              // error={formik.touched.password && Boolean(formik.errors.password)}
              >
                <InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
                <FilledInput
                  id="filled-adornment-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  // value={formik.values.password}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
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
                {/* {formik.touched.password && formik.errors.password && (
                <Typography variant="caption" color="error">
                  {formik.errors.password}
                </Typography>
              )} */}
              </FormControl>
            </Grid>

            <Grid size={6}>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ marginBottom: 1, borderRadius: 10 }}
              // error={formik.touched.password && Boolean(formik.errors.password)}
              >
                <InputLabel htmlFor="filled-adornment-repeat-password">Repetir Contraseña</InputLabel>
                <FilledInput
                  id="filled-adornment-repeat-password"
                  name="repeat-password"
                  type={showPassword ? "text" : "password"}
                  // value={formik.values.password}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
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
                {/* {formik.touched.password && formik.errors.password && (
                <Typography variant="caption" color="error">
                  {formik.errors.password}
                </Typography>
              )} */}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Typography
                sx={{ fontWeight: '600', fontSize: '1.5rem', color: "#242424", marginBottom: 3 }}
                variant="h5"
                component="h4"
                gutterBottom
              >
                Seleccione Tipo de Usuario:
              </Typography>
              <ToggleButtonGroup size="large" {...control} aria-label="Large sizes">
                {children}
              </ToggleButtonGroup>

            </Grid>
            {modoAdminCreate ? <GasStationForm /> : <ClientForm />}
            <Grid size={12}>
              <Button
                type="submit"
                //disabled={!(formik.dirty && formik.isValid)}
                sx={{
                  marginBottom: 1,
                  width: "75%",
                  height: '3rem',
                  fontSize: '1rem',
                  borderRadius: 20,
                  backgroundColor: '#1E8BC3',
                  fontWeight: '500quiero'

                }}
                variant="contained"
              >
                {`Registrar ${!modoAdminCreate ? "Cliente" : "Gasolinera"}`}
              </Button>
            </Grid>
          </Grid>



        </CardContent>
      </Box>
    </Container>
  );
}

export default RegisterPage;