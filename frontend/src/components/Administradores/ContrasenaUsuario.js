import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
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

const ActualizarUsuario = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [password, setPassword] = useState({
    contrasena_usuario: "",
    contrasena_usuario_repeat: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const params = useParams();

  const goBack = () => navigate("/usuarios");

  useEffect(() => {
    setErrorMsg("");
  }, [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (password.contrasena_usuario === password.contrasena_usuario_repeat) {
        const response = await axiosPrivate.put(
          "/usuarios/actualizar/contrasena/" + params.id,
          JSON.stringify(password)
        );
        console.log(response.data);
        navigate("/usuarios");
      } else {
        setErrorMsg("Las contraseñas no coinciden");
        errRef.current.focus();
      }
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "Contrasena no encontrada en la base de datos, intente de nuevo"
        );
        errRef.current.focus();
      }
    }
  };

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cambiar Contraseña
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
            Ingrese una nueva contraseña:
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
                  Ingrese una nueva contraseña:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="contrasena_usuario"
                  value={password.contrasena_usuario}
                  type="password"
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  placeholder="Ingrese su contraseña"
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
                  Repita la nueva contraseña:
                </Typography>
                <TextField
                  required
                  onChange={handleChange}
                  name="contrasena_usuario_repeat"
                  value={password.contrasena_usuario_repeat}
                  type="password"
                  sx={{ padding: 1 }}
                  variant="filled"
                  fullWidth
                  placeholder="Ingrese su contraseña"
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
                Cambiar Contraseña
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
