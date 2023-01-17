import { useState, useEffect, useRef } from "react";
import useAxiosPrivateFile from "../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

import * as React from "react";

import {
  AppBar,
  Container,
  Button,
  Toolbar,
  Typography,
  Box,
  Grid,
  Stack,
  Alert,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from "@mui/material/";

import { PhotoCamera } from "@mui/icons-material";

const CrearDiagnostico = () => {
  //Loader State
  const [loading, setLoading] = useState(false);

  //Manejador de imagenes
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");

  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [diagnostico, setDiagnostico] = useState({
    usuarios_id_usuario: "",
    pacientes_id_paciente: "",
    retino_imagen: "",
  });

  const axiosPrivate = useAxiosPrivateFile();
  const navigate = useNavigate();
  const goBack = () => navigate("/diagnosticos");

  const effectRan = useRef(false);

  const [usuarios, setUsuarios] = useState();
  const [pacientes, setPacientes] = useState();

  const location = useLocation();

  useEffect(() => {
    setErrorMsg("");
  }, [diagnostico]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getUsuarios = async () => {
        try {
          const response = await axiosPrivate.get("/empleados", {
            signal: controller.signal,
          });
          isMounted && setUsuarios(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getUsuarios();
      return () => {
        isMounted = false;
        controller.abort();
      };
    }
    return () => {
      effectRan.current = true;
    };
  }, [axiosPrivate, navigate, location]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getPacientes = async () => {
        try {
          const response = await axiosPrivate.get("/pacientes", {
            signal: controller.signal,
          });
          isMounted && setPacientes(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getPacientes();
      return () => {
        isMounted = false;
        controller.abort();
      };
    }
    return () => {
      effectRan.current = true;
    };
  }, [axiosPrivate, navigate, location]);

  const handleImageChange = (event) => {
    setFileName(event.target.files[0].name);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      usuarios_id_usuario: diagnostico.usuarios_id_usuario,
      pacientes_id_paciente: diagnostico.pacientes_id_paciente,
      retino_imagen: image.split(",")[1], // remove data:image/png;base64,
    };
    try {
      const response = await axiosPrivate.post("/diagnosticos/crear", body);
      console.log(response);
      setLoading(false);
      navigate("/diagnosticos");
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "La usuario o paciente no se encuentran registrados en el sistema"
        );
        errRef.current.focus();
      }
    }
  };

  const handleChange = (e) =>
    setDiagnostico({ ...diagnostico, [e.target.name]: e.target.value });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Registrar Diagnostico
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
            Ingrese los datos del paciente:
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
                  Seleccione el usuario:
                </Typography>
                <FormControl sx={{ color: "white" }} style={{ width: 250 }}>
                  <Select
                    required
                    onChange={handleChange}
                    sx={{ color: "white" }}
                    name="usuarios_id_usuario"
                    value={diagnostico.usuarios_id_usuario}
                  >
                    {usuarios?.map((usuario) => (
                      <MenuItem
                        key={usuario.id_usuario}
                        value={usuario.id_usuario}
                      >
                        {usuario.nombre_usuario + " " + usuario.apellido_usuario}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Seleccione el paciente:
                </Typography>
                <FormControl sx={{ color: "white" }} style={{ width: 250 }}>
                  <Select
                    required
                    onChange={handleChange}
                    sx={{ color: "white" }}
                    name="pacientes_id_paciente"
                    value={diagnostico.pacientes_id_paciente}
                  >
                    {pacientes?.map((paciente) => (
                      <MenuItem
                        key={paciente.id_paciente}
                        value={paciente.id_paciente}
                      >
                        {paciente.nombre_paciente + " " + paciente.apellido_paciente}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "justify",
                    fontSize: "18px",
                  }}
                >
                  Seleccione una imagen:
                </Typography>
                <TextField
                  required
                  value={fileName}
                  variant="filled"
                  color="warning"
                  inputProps={{ style: { color: "white", fontSize: "26px", fontStyle:"color:"} }}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "26px" },
                  }}
                ></TextField>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    required
                    hidden
                    id="retino_imagen"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <PhotoCamera />
                </IconButton>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress color='inherit' size={24} /> : 'Diagnosticar'}
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

export default CrearDiagnostico;
