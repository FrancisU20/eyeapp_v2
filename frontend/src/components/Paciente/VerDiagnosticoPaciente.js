import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import * as React from "react";

import base64 from "base64-js";

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
  CardMedia,
} from "@mui/material/";

const VerDiagnostico = () => {
  //Manejador de imagen
  const [imagen, setImagen] = useState("");

  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [diagnostico, setDiagnostico] = useState({
    id_diagnostico: "",
    retino_imagen: "",
    usuarios_id_usuario: "",
    pacientes_id_paciente: "",
    retino_diagnostico: "",
    apellido_paciente: "",
    nombre_paciente: "",
    nickname_usuario: "",
    fecha_diagnostico: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const goBack = () => navigate(-1);
  const effectRan = useRef(false);

  useEffect(() => {
    setErrorMsg("");
  }, [diagnostico]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getDiagnostico = async (id) => {
        try {
          const response = await axios.get(
            "/diagnosticos/paciente/ver/" + id
          );

          const imagenArray = response.data.retino_imagen.data;
          const imagenBase64 = base64.fromByteArray(imagenArray);
          const atobImage = atob(imagenBase64);
          setImagen(atobImage);

          isMounted && setDiagnostico(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      if (params.id) {
        getDiagnostico(params.id);
      }

      return () => {
        isMounted = false;
        controller.abort();
      };
    }
    return () => {
      effectRan.current = true;
    };
  }, [navigate, location, params.id]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ver Diagnostico
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
          <Typography sx={{ mt: 3, textAlign: "justify" }}>
            Resultado de Predicción:
          </Typography>
          <Grid container sx={{ flexGrow: 1 }}>
            <Typography
              sx={{
                mt: 3,
                textAlign: "justify",
                fontSize: "18px",
              }}
            >
              Diagnostico: {diagnostico.id_diagnostico}
            </Typography>
            <Typography
              sx={{
                mt: 3,
                textAlign: "justify",
                fontSize: "18px",
                ml: 3,
              }}
            >
              Fecha: {diagnostico.fecha_diagnostico}
            </Typography>
            <Typography
              sx={{
                mt: 3,
                textAlign: "justify",
                fontSize: "18px",
                ml: 3,
              }}
            >
              Analista: {diagnostico.nickname_usuario}
            </Typography>
            <Typography
              sx={{
                mt: 3,
                textAlign: "justify",
                fontSize: "18px",
                ml: 3,
              }}
            >
              Paciente:{" "}
              {diagnostico.nombre_paciente +
                " " +
                diagnostico.apellido_paciente}
            </Typography>
            <Grid item xs={12}>
              <Typography
                sx={{
                  mt: 3,
                  fontSize: "18px",
                  textAlign: "justify",
                }}
              >
                Retinografía:
              </Typography>
              <CardMedia
                style={{ display: "flex", alignItems: "center" }}
                component="img"
                alt="Imagen"
                sx={{
                  width: 480,
                  height: 480,
                  mt: "25px",
                  borderRadius: 5,
                }}
                image={`data:image/png;base64,${imagen}`}
                title="Diagnostico"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  mt: 3,
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                DIAGNÓSTICO
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                {diagnostico.retino_diagnostico}
              </Typography>
            </Grid>
          </Grid>
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

export default VerDiagnostico;
