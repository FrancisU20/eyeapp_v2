import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import * as React from "react";

import {
  AppBar,
  Container,
  Button,
  Toolbar,
  Typography,
  Box,
  Grid,
  TextField,
  Stack,
  Alert,
} from "@mui/material/";

import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ActualizarPaciente = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [paciente, setPaciente] = useState({
    cedula_paciente: "",
    nombre_paciente: "",
    apellido_paciente: "",
    nac_paciente: "",
    email_paciente: "",
    celular_paciente: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const goBack = () => navigate("/pacientes");
  const effectRan = useRef(false);

  useEffect(() => {
    setErrorMsg("");
  }, [paciente]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getPaciente = async (id) => {
        try {
          const response = await axiosPrivate.get("/pacientes/" + id, {
            signal: controller.signal,
          });
          isMounted && setPaciente(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      if (params.id) {
        getPaciente(params.id);
      }

      return () => {
        isMounted = false;
        controller.abort();
      };
    }
    return () => {
      effectRan.current = true;
    };
  }, [axiosPrivate, navigate, location, params.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosPrivate.put(
        "/pacientes/actualizar/" + params.id,
        JSON.stringify(paciente)
      );
      console.log(response.data);
      navigate("/pacientes");
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg("La cedula, email, celular ya se encuentran registrados");
        errRef.current.focus();
      }
    }
  };

  const handleChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });
  };

  const [fecha, setFecha] = React.useState(dayjs());

  const handleChangeFecha = (newFecha) => {
    setFecha(newFecha);
    paciente.nac_paciente = fecha.format("YYYY-MM-DD");
  };

  const validateIdNumber = (event) => {
    const dni = event.target.value;
    //Validamos que la cédula solo contenga 10 dígitos
    if (dni.length === 10) {
      //Definimos el último dígito o tambien llamado dígito verificador
      const lastDigit = parseInt(dni[dni.length - 1]);

      //Definimos variables a utilizar
      let pares = 0;
      let impares = 0;
      let suma = 0;

      //Iteramos cada item excluyendo el último digito, aplicando el Algoritmo de Luhn
      for (let i = 1; i <= dni.length - 1; i++) {
        if (i % 2 === 0) {
          pares += parseInt(dni[i - 1]);
        } else {
          let x = parseInt(dni[i - 1]) * 2;
          x > 9 ? (impares += x - 9) : (impares += x);
        }
      }

      suma += pares + impares;

      //extraemos el primer digito de la suma
      const firstDigit = parseInt(suma.toString()[0]);

      //Obtenemos la decena
      const decena = (firstDigit + 1) * 10;

      //Obtenemos el digito validador
      let validatorDigit = decena - suma;

      //Si el dígito verificador es mayor a 10 lo igualamos a 0
      if (validatorDigit >= 10) {
        validatorDigit = 0;
      }

      //Codigo de provincia
      //Validamos si la cedula pertenece a alguna provincia
      const provinceCode = parseInt(dni[0] + dni[1]);

      //Valida cédulas locales y de Ecuatorianos en el exterior
      if (provinceCode > 24 && provinceCode !== 30) {
        setErrorMsg("La cédula es incorrecta no pertenece a ninguna provincia");
        errRef.current.focus();
      }
      console.log("Codigo de Provincia: " + provinceCode);

      if (validatorDigit === lastDigit) {
        return `Esta cédula es correcta: ${dni}`;
      } else {
        setErrorMsg(`Esta cédula es incorrecta : ${dni}`);
        errRef.current.focus();
      }
    } else {
      setErrorMsg(`La cédula debe tener 10 dígitos unicamente`);
      errRef.current.focus();
    }
  };

  const validateCellphone = (event) => {
    const number = event.target.value;
    const regex = /^09\d{8}$/;
    regex.test(number);
    if (regex.test(number) !== true) {
      setErrorMsg(" Número de celular incorrecto");
      errRef.current.focus();
    }
  };

  const validateEmail = (event) => {
    const email = event.target.value;
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    regex.test(email);
    if (regex.test(email) !== true) {
      setErrorMsg(" Email incorrecto");
      errRef.current.focus();
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Editar Paciente
          </Typography>
          <Button variant="contained" color="warning" onClick={goBack}>
            Regresar
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#1E272E",
            padding: 3,
            mt: 3,
            borderRadius: 5,
          }}
        >
          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Ingrese los datos personales:
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container sx={{ flexGrow: 1 }}>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Cédula:
                </Typography>
                <TextField
                  required
                  onBlur={validateIdNumber}
                  onChange={handleChange}
                  name="cedula_paciente"
                  value={paciente.cedula_paciente}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su cédula"
                  inputProps={{
                    pattern: "[0-9]*",
                    style: { color: "white", fontSize: "18px" },
                  }}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "18px" },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Nombre:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="nombre_paciente"
                  value={paciente.nombre_paciente}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su nombre"
                  inputProps={{ style: { color: "white", fontSize: "18px" } }}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "18px" },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Apellido:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="apellido_paciente"
                  value={paciente.apellido_paciente}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su apellido"
                  inputProps={{ style: { color: "white", fontSize: "18px" } }}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "18px" },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Fecha de Nacimiento:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={paciente.nac_paciente}
                    onChange={handleChangeFecha}
                    renderInput={(params) => <TextField {...params} />}
                    inputProps={{ style: { color: "white", fontSize: "18px" } }}
                    InputLabelProps={{
                      style: { color: "white", fontSize: "18px" },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Email:
                </Typography>
                <TextField
                  required
                  onBlur={validateEmail}
                  onChange={handleChange}
                  name="email_paciente"
                  value={paciente.email_paciente}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su Email"
                  inputProps={{
                    style: { color: "white", fontSize: "18px" },
                  }}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "18px" },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Celular:
                </Typography>
                <TextField
                  required
                  onBlur={validateCellphone}
                  onChange={handleChange}
                  name="celular_paciente"
                  value={paciente.celular_paciente}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su celular"
                  inputProps={{ style: { color: "white", fontSize: "18px" } }}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "18px" },
                  }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Actualizar Paciente
              </Button>
            </Box>
          </form>
        </Box>
        <Stack
          sx={{ width: "100%", padding: "1rem" }}
          spacing={2}
          ref={errRef}
          className={errorMsg ? "errorMsg" : "offscreen"}
          aria-live="assertive"
        >
          <Alert severity="error">{errorMsg}</Alert>
        </Stack>
      </Container>
    </>
  );
};

export default ActualizarPaciente;
