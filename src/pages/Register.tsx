// RegisterPage.tsx - Fixed version
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, CardContent, CardMedia, Container, Dialog, DialogActions, DialogTitle, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GasStationForm from "../components/GasStationForm";
import { ClientForm } from "../components/ClientForm";
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import type { RegisterCustomerRequest, RegisterGasStationRequest, RegisterUserRequest } from "../services/models/authModels";
import { array, boolean, number, object, string, ref } from "yup";
import { useFormik } from "formik";
import { registerCustomer, registerGasStation } from "../services/authService";
import { UserRegistrationError } from "../services/errors/authErrors";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";


const schema = object({
  email: string().email("email no valido").required("email obligatorio"),
  password: string().min(6, "la contraseña debe tener 6 caracteres").required("La Contraseña es obligatoria"),
  confirmPassword: string()
    .oneOf([ref("password")], "Las contraseñas no coinciden")
    .required("Debe confirmar la contraseña"),
  name: string().min(1).max(24).required("nombre obligatorio"),
  lastname: string().min(1).max(24).required("apellidos obligatorios"),
  admin_role: boolean().required(),
  // Customer fields - conditional validation
  license: string().when('admin_role', {
    is: false,
    then: (schema) => schema.required("Licencia es obligatoria para clientes").min(6),
    otherwise: (schema) => schema.when('admin_role', {
      is: true,
      then: (schema) => schema.required("Licencia es obligatoria para gasolineras").min(6),
      otherwise: (schema) => schema.optional()
    })
  }),
  carPlate: string().when('admin_role', {
    is: false,
    then: (schema) => schema.min(6).max(7).optional(),
    otherwise: (schema) => schema.optional()
  }),
  // Gas Station fields - conditional validation
  gasStationName: string().when('admin_role', {
    is: true,
    then: (schema) => schema.required("Nombre de gasolinera es obligatorio").min(6).max(25),
    otherwise: (schema) => schema.optional()
  }),
  address: string().when('admin_role', {
    is: true,
    then: (schema) => schema.required("Dirección es obligatoria").min(20).max(70),
    otherwise: (schema) => schema.optional()
  }),
  openTime: string().when('admin_role', {
    is: true,
    then: (schema) => schema.required("Hora de apertura es obligatoria"),
    otherwise: (schema) => schema.optional()
  }),
  closeTime: string().when('admin_role', {
    is: true,
    then: (schema) => schema.required("Hora de cierre es obligatoria"),
    otherwise: (schema) => schema.optional()
  }),
  open: boolean().optional(),
  zone: number().when('admin_role', {
    is: true,
    then: (schema) => schema.positive().required("Zona es obligatoria"),
    otherwise: (schema) => schema.optional()
  }),
  serviceDays: array().of(string()).when('admin_role', {
    is: true,
    then: (schema) => schema.min(1, "Debe seleccionar al menos un día de servicio"),
    otherwise: (schema) => schema.optional()
  })
});

function RegisterPage() {
  const [modoAdminCreate, setModoAdminCreate] = useState(false);

  const [regError, setRegError] = useState(false);
  const [errorMessage,seterrorMessage]=useState("");
  const handleToastClose = () => {
    setRegError(false);
  };

  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClickOpen = () => {
    setOpenConfirm(true);
  };

  const handleClose = () => {
    setOpenConfirm(false);
    navigate("/login", {
      replace: true,
    });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastname: "",
      admin_role: false,
      // validation for customer
      license: "",
      carPlate: "",
      // validation for gasStation
      gasStationName: "",
      address: "",
      openTime: "",  // Changed to string for time inputs
      closeTime: "",  // Changed to string for time inputs
      open: false,
      zone: 0,
      serviceDays: [] as string[], // Fixed type
    },
    validationSchema: schema,
    onSubmit: async (values: any) => {
      console.log("Form values:", values);
      const userData:RegisterUserRequest={
        email:values.email,
        password:values.password,
        name:values.name,
        lastname:values.lastname
      }

      console.log("USERDATA:",userData)
      
      try {
        if (values.admin_role) {
          // Gas Station Registration
          const gasStationData: RegisterGasStationRequest = {
            user: userData,
            gasStationName: values.gasStationName,
            address: values.address,
            openTime: values.openTime,
            closeTime: values.closeTime,
            open: values.open,
            zone: values.zone,
            license: values.license,
            serviceDays: values.serviceDays
          };
          console.log('gas station data:',gasStationData)
          
          const result = await registerGasStation(gasStationData);
          console.log("Gas station registered successfully:", result);
          
        } else {
          // Customer Registration
          const customerData: RegisterCustomerRequest = {
            user: userData,
            license: values.license,
            car_plate: values.carPlate
          };
          
          const result = await registerCustomer(customerData);
          console.log("Customer registered successfully:", result);
        }
        handleClickOpen()
        // Handle success (redirect, show message, etc.)
        
      } catch (error) {
        setRegError(true);
        if (error instanceof UserRegistrationError) {
          console.error("Registration error:", error);
          // Handle specific registration errors
          seterrorMessage(error.message)
        } else {
          console.error("Unexpected error:", error);
          seterrorMessage(error.message)
        }
        
        
        formik.resetForm();
      }
    }
  });

  useEffect(() => {
    formik.setFieldValue("admin_role", modoAdminCreate);
  }, [modoAdminCreate]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newModoAdmin: boolean,
  ) => {
    setModoAdminCreate(newModoAdmin);
  };

  const children = [
    <ToggleButton value={false} key="Cliente" sx={{ display: "flex", flexDirection: 'column' }}>
      <PersonIcon sx={{ height: 50, width: 50 }} />
      <Typography
        sx={{ width: 110, fontWeight: '600', fontSize: '1rem', color: !modoAdminCreate ? "#242424" : "#757575" }}
        variant="h5"
        component="h5"
      >
        Cliente
      </Typography>
    </ToggleButton>,

    <ToggleButton value={true} key="Gasolinera" sx={{ display: "flex", flexDirection: 'column' }}>
      <LocalGasStationIcon sx={{ height: 50, width: 50 }} />
      <Typography
        sx={{ width: 110, fontWeight: '600', fontSize: '1rem', color: modoAdminCreate ? "#242424" : "#757575" }}
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

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  

  return (
    <Container maxWidth='xs' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
      <Dialog
        open={openConfirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Cuenta Registrada Exitosamente"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Aceptar</Button>
        </DialogActions>
      </Dialog>
      <Toast
              open={regError}
              message={errorMessage}
              severity="error"
              onClose={handleToastClose}
            />
      <Box sx={{ marginY: 8, width: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent
            sx={{
              marginTop: 1,
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  helperText={formik.touched.name && formik.errors.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastname}
                  helperText={formik.touched.lastname && formik.errors.lastname}
                  error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                  sx={{ marginBottom: 0, borderRadius: 10 }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  id="input-email-textfield"
                  label="Correo electrónico"
                  variant="filled"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  helperText={formik.touched.email && formik.errors.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  sx={{ marginBottom: 0, borderRadius: 10 }}
                />
              </Grid>
              <Grid size={6}>
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ marginBottom: 1, borderRadius: 10 }}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                >
                  <InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
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
                      {formik.errors.password.toString()}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ marginBottom: 1, borderRadius: 10 }}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                >
                  <InputLabel htmlFor="filled-adornment-repeat-password">Repetir Contraseña</InputLabel>
                  <FilledInput
                    id="filled-adornment-repeat-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <Typography variant="caption" color="error">
                      {formik.errors.confirmPassword.toString()}
                    </Typography>
                  )}
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
              {modoAdminCreate ?
                <GasStationForm
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  values={formik.values}
                  setFieldValue={formik.setFieldValue}
                  touched={formik.touched}
                  errors={formik.errors}
                />
                :
                <ClientForm
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  values={formik.values}
                  touched={formik.touched}
                  errors={formik.errors}
                />}
              <Grid size={12}>
                <Button
                  type="submit"
                  disabled={!(formik.dirty && formik.isValid)}
                  sx={{
                    marginBottom: 1,
                    width: "75%",
                    height: '3rem',
                    fontSize: '1rem',
                    borderRadius: 20,
                    backgroundColor: '#1E8BC3',
                    fontWeight: '500'
                  }}
                  variant="contained"
                >
                  {`Registrar ${!modoAdminCreate ? "Cliente" : "Gasolinera"}`}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;