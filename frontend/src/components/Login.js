//Importar Librerias
import React from "react";
import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, Stack } from "@mui/material";

//Importar Axios
const LOGIN_URL = "/login";

//Importar Componentes
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //Direcciones de Usuarios por rol
  const mAdmin = location.state?.mAdmin?.pathname || "/Admin";
  const mEmpleado = location.state?.mAdmin?.pathname || "/Empleado";
  const mPaciente = location.state?.mAdmin?.pathname || "/Paciente";

  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [nickname_usuario, setUsuario] = useState("");
  const [contrasena_usuario, setContrasena] = useState("");
  const [cedula_paciente, setCedula] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [nickname_usuario, contrasena_usuario, cedula_paciente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          nickname_usuario,
          contrasena_usuario,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const token = response?.data?.token;
      const roles = response?.data?.rol;

      setAuth({ nickname_usuario, contrasena_usuario, roles, token });
      setUsuario("");
      setContrasena("");
      if (roles === 1) {
        navigate(mAdmin, { replace: true });
      } else if (roles === 2) {
        navigate(mEmpleado, { replace: true });
      } else if (roles === 3) {
        navigate(mPaciente, { replace: true });
      } else {
        navigate("/Login", { replace: true });
      }
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("Error de conexion");
      } else if (error.response?.status === 400) {
        setErrorMsg(
          "La contraseña ingresada no coincide con nuestros registros"
        );
      } else if (error.response?.status === 402) {
        setErrorMsg("El usuario ingresado no existe en nuestros registros");
      } else if (error.response?.status === 401) {
        setErrorMsg("Sin autorizacion");
      } else {
        setErrorMsg("Inicio de Sesion Fallido");
      }
      errRef.current.focus();
    }
  };

  const handleDiagnostico = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/pacientes", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const pacientes = response.data;
      pacientes?.map((paciente) =>
        paciente.cedula_paciente === cedula_paciente
          ? navigate(`/diagnosticos/paciente/${cedula_paciente}`)
          : setErrorMsg("El paciente no tiene diagnósticos")
      );
    } catch (error) {}
  };

  return (
    <section>
      <Stack
        sx={{ width: "100%", padding: "1rem" }}
        spacing={2}
        ref={errRef}
        className={errorMsg ? "errorMsg" : "offscreen"}
        aria-live="assertive"
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Stack>
      <h1>Iniciar Sesion</h1>
      <img
        src={require("../assets/logo.png")}
        alt="img"
        style={{ borderRadius: 15 }}
      />
      <form onSubmit={handleSubmit}>
        <label htmlFor="nickname_usuario">Usuario:</label>
        <input
          type="text"
          id="nickname_usuario"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUsuario(e.target.value)}
          value={nickname_usuario}
          required
        />

        <label htmlFor="contrasena_usuario">Contrasena:</label>
        <input
          type="password"
          id="contrasena_usuario"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setContrasena(e.target.value)}
          value={contrasena_usuario}
          required
        />

        <button>Iniciar Sesion</button>
      </form>
      <form onSubmit={handleDiagnostico}>
        <h1>Consulte su diagnóstico</h1>
        <input
          type="text"
          id="cedula_paciente"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setCedula(e.target.value)}
          value={cedula_paciente}
          placeholder="Ingrese su cédula"
          required
        />
        <button>Consultar</button>
      </form>
    </section>
  );
};

export default Login;
