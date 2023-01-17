import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material/";

const ActualizarUsuario = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [user, setUser] = useState({
    cedula_usuario: "",
    nombre_usuario: "",
    apellido_usuario: "",
    email_usuario: "",
    celular_usuario: "",
    nickname_usuario: "",
    roles_id_rol: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const goBack = () => navigate("/usuarios");
  const effectRan = useRef(false);

  useEffect(() => {
    setErrorMsg("");
  }, [user]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getUser = async (id) => {
        try {
          const response = await axiosPrivate.get("/usuarios/" + id, {
            signal: controller.signal,
          });
          isMounted && setUser(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      if (params.id) {
        getUser(params.id);
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
        "/usuarios/actualizar/" + params.id,
        JSON.stringify(user)
      );
      console.log(response.data);
      navigate("/usuarios");
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "La cedula, email, celular o nickname ya se encuentran registrados"
        );
        errRef.current.focus();
      }
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Editar Usuario
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
                  onChange={handleChange}
                  name="cedula_usuario"
                  value={user.cedula_usuario}
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
                  name="nombre_usuario"
                  value={user.nombre_usuario}
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
                  name="apellido_usuario"
                  value={user.apellido_usuario}
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
                  Email:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="email_usuario"
                  value={user.email_usuario}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su Email"
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
                  Celular:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="celular_usuario"
                  value={user.celular_usuario}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su celular"
                  inputProps={{
                    style: { color: "white", fontSize: "18px" },
                    endAdornment: null,
                    startAdornment: null,
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
                  Nickname:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="nickname_usuario"
                  value={user.nickname_usuario}
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  type="text"
                  placeholder="Ingrese su nickname"
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
                  Rol:
                </Typography>
                <FormControl sx={{ color: "white", width: 300, padding: 1 }}>
                  <Select
                    onChange={handleChange}
                    name="roles_id_rol"
                    value={user.roles_id_rol}
                    sx={{ color: "white", fontSize: "18px" }}
                  >
                    <MenuItem value={1} sx={{ fontSize: "18px" }}>
                      Administrador
                    </MenuItem>
                    <MenuItem value={2} sx={{ fontSize: "18px" }}>
                      Empleado
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Actualizar Usuario
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

export default ActualizarUsuario;
