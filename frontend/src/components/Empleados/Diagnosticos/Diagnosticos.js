import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

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
  IconButton,
} from "@mui/material/";

const Diagnosticos = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [diagnosticos, setDiagnosticos] = useState();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate("/empleado");
  const goCreate = () => navigate("/diagnosticos/crear");
  const effectRan = useRef(false);

  useEffect(() => {
    setErrorMsg("");
  }, [diagnosticos]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getDiagnosticos = async () => {
        try {
          const response = await axiosPrivate.get("/diagnosticos", {
            signal: controller.signal,
          });
          isMounted && setDiagnosticos(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getDiagnosticos();
      return () => {
        isMounted = false;
        controller.abort();
      };
    }
    return () => {
      effectRan.current = true;
    };
  }, [axiosPrivate, navigate, location]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete("/diagnosticos/eliminar/" + id);
      setDiagnosticos(
        diagnosticos.filter((diagnostico) => diagnostico.id_diagnostico !== id)
      );
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "El diagnostico no se puede eliminar porque tiene registros asociados"
        );
        errRef.current.focus();
      }
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#2d3436" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Diagnosticos
          </Typography>
          <IconButton
            onClick={goBack}
            variant="contained"
            sx={{ color: "white" }}
          >
            <ArrowBack></ArrowBack>
          </IconButton>
          <Button
            variant="contained"
            color="success"
            onClick={goCreate}
            sx={{ ml: 1 }}
          >
            Agregar
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
                  {
                    diagnostico.nombre_paciente + " " + diagnostico.apellido_paciente
                  }
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {diagnostico.retino_diagnostico}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/diagnosticos/ver/${diagnostico.id_diagnostico}`)
                    }
                  >
                    Ver Diagnostico
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(diagnostico.id_diagnostico)}
                    style={{ marginLeft: ".5rem" }}
                  >
                    Eliminar
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
