import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import * as React from "react";
import {
  AppBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Toolbar,
  Typography,
  Stack,
  Alert,
} from "@mui/material/";

const Diagnosticos = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [diagnosticos, setDiagnosticos] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const effectRan = useRef(false);

  const goBack = () => navigate("/login");

  useEffect(() => {
    setErrorMsg("");
  }, [diagnosticos]);

  useEffect(() => {
    if (effectRan.current === true) {
      const controller = new AbortController();

      const getDiagnosticos = async (id) => {
        try {
          const response = await axios.get(
            "/diagnosticos/paciente/" + id,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response);
          setDiagnosticos(response.data);
        } catch (error) {
          if (!error?.response) {
            setErrorMsg("Error de conexion");
          } else if (error.response?.status === 404) {
            setErrorMsg(
              "No se ha encontrado diagnosticos con la cedula ingresada"
            );
          } else {
            setErrorMsg("Error al buscar el diagnostico");
          }
        }
      };

      if (params.id) {
        getDiagnosticos(params.id);
      }
      return () => {
        controller.abort();
      };
    }
    return () => {
      effectRan.current = true;
    };
  }, [navigate, location, params.id]);

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#2d3436" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Diagnosticos
          </Typography>
          <Button
            variant="contained"
            color="warning"
            onClick={goBack}
            sx={{ ml: 1 }}
          >
            Regresar
          </Button>
        </Toolbar>
      </AppBar>
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>
                Fecha de Diagnóstico
              </TableCell>
              <TableCell sx={{ color: "white" }}>Usuario</TableCell>
              <TableCell sx={{ color: "white" }}>Paciente</TableCell>
              <TableCell sx={{ color: "white" }}>Diagnóstico</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagnosticos?.map((diagnostico) => (
              <TableRow
                key={diagnostico.id_diagnostico}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {diagnostico.fecha_diagnostico}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {diagnostico.nickname_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {diagnostico.nombre_paciente + " " + diagnostico.apellido_paciente}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {diagnostico.retino_diagnostico}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(
                        `/diagnosticos/paciente/ver/${diagnostico.id_diagnostico}`
                      )
                    }
                  >
                    Ver Diagnostico
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        sx={{ width: "100%", padding: "1rem" }}
        spacing={2}
        ref={errRef}
        className={errorMsg ? "errorMsg" : "offscreen"}
        aria-live="assertive"
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Stack>
    </>
  );
};

export default Diagnosticos;
