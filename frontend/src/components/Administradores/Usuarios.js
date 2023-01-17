import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowBack, Key } from "@mui/icons-material";

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

const Usuarios = () => {
  //Manejador de errores
  const [errorMsg, setErrorMsg] = useState("");
  const errRef = useRef();

  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate("/admin");
  const goCreate = () => navigate("/usuarios/crear");
  const effectRan = useRef(false);

  const rolesString = {
    1: "Administrador",
    2: "Empleado",
    3: "Paciente",
  };

  useEffect(() => {
    setErrorMsg("");
  }, [users]);

  useEffect(() => {
    if (effectRan.current === true) {
      let isMounted = true;
      const controller = new AbortController();

      const getUsers = async () => {
        try {
          const response = await axiosPrivate.get("/usuarios", {
            signal: controller.signal,
          });
          isMounted && setUsers(response.data);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getUsers();
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
      await axiosPrivate.delete("/usuarios/eliminar/" + id);
      setUsers(users.filter((user) => user.id_usuario !== id));
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "El usuario no se puede eliminar porque tiene registros asociados"
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
            Usuarios
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
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Celular</TableCell>
              <TableCell sx={{ color: "white" }}>Usuario</TableCell>
              <TableCell sx={{ color: "white" }}>Rol</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow
                key={user.id_usuario}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {user.cedula_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {user.nombre_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {user.apellido_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {user.email_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {user.celular_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {user.nickname_usuario}
                </TableCell>
                <TableCell sx={{ color: "white" }} component="th" scope="row">
                  {rolesString[user.roles_id_rol]}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                      navigate(
                        `/usuarios/actualizar/contrasena/${user.id_usuario}`
                      )
                    }
                  >
                    <Key/>
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/usuarios/actualizar/${user.id_usuario}`)
                    }
                  >
                    Editar
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user.id_usuario)}
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

export default Usuarios;
