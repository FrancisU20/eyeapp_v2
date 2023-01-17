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

const Pacientes = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [pacientes, setPacientes] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate("/empleado");
  const goCreate = () => navigate("/pacientes/crear");
  const effectRan = useRef(false);

  useEffect(() => {
    setErrorMsg("");
  }, [pacientes]);

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

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete("/pacientes/eliminar/" + id);
      setPacientes(pacientes.filter((paciente) => paciente.id_paciente !== id));
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "El paciente no se puede eliminar porque tiene registros asociados"
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
            Pacientes
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
              <TableCell sx={{ color: "white" }}>Cédula</TableCell>
              <TableCell sx={{ color: "white" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white" }}>Apellido</TableCell>
              <TableCell sx={{ color: "white" }}>Fecha de Nacimiento</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Celular</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientes?.map((paciente) => (
              <TableRow
                key={paciente.id_paciente}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {paciente.cedula_paciente}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {paciente.nombre_paciente}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {paciente.apellido_paciente}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {paciente.nac_paciente}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {paciente.email_paciente}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {paciente.celular_paciente}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/pacientes/actualizar/${paciente.id_paciente}`)
                    }
                  >
                    Editar
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(paciente.id_paciente)}
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

export default Pacientes;
