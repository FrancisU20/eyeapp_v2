import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";

import Admin from "./components/Administradores/Admin";
import EditarUsuario from "./components/Administradores/EditarUsuario";
import Usuarios from "./components/Administradores/Usuarios";
import CrearUsuario from "./components/Administradores/CrearUsuario";
import ContrasenaUsuario from "./components/Administradores/ContrasenaUsuario";

import Empleado from "./components/Empleados/Empleado";
import Pacientes from "./components/Empleados/Pacientes/Pacientes";
import CrearPaciente from "./components/Empleados/Pacientes/CrearPaciente";
import EditarPaciente from "./components/Empleados/Pacientes/EditarPaciente";

import Diagnosticos from "./components/Empleados/Diagnosticos/Diagnosticos";
import CrearDiagnostico from "./components/Empleados/Diagnosticos/CrearDiagnostico";
import VerDiagnostico from "./components/Empleados/Diagnosticos/VerDiagnostico";


import Paciente from "./components/Paciente/DiagnosticosPaciente";
import PacienteDiagnostico from "./components/Paciente/VerDiagnosticoPaciente";

import DiagnosticosPaciente from "./components/Paciente/DiagnosticosPaciente";
import VerDiagnosticosPaciente from "./components/Paciente/VerDiagnosticoPaciente";

const ROLES = {
  Admin: 1,
  Medico: 2,
  Client: 3,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas Publicas */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="diagnosticos/paciente/:id" element={<DiagnosticosPaciente />}></Route>
        <Route path="diagnosticos/paciente/ver/:id" element={<VerDiagnosticosPaciente />}></Route>

        {/* Rutas Privadas */}
        <Route element={<RequireAuth allowedRoles={ROLES.Admin} />}>
          <Route path="admin" element={<Admin />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/crear" element={<CrearUsuario />} />
          <Route path="usuarios/actualizar/:id" element={<EditarUsuario />} />
          <Route path="usuarios/actualizar/contrasena/:id" element={<ContrasenaUsuario />} />
        </Route>

        {/* Rutas Privadas */}
        <Route element={<RequireAuth allowedRoles={ROLES.Medico} />}>
          <Route path="empleado" element={<Empleado />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="pacientes/crear" element={<CrearPaciente />} />
          <Route path="pacientes/actualizar/:id" element={<EditarPaciente />} />
          <Route path="diagnosticos" element={<Diagnosticos />} />
          <Route path="diagnosticos/crear" element={<CrearDiagnostico />} />
          <Route path="diagnosticos/ver/:id" element={<VerDiagnostico />} />
        </Route>

        {/* Rutas Privadas */}
        <Route element={<RequireAuth allowedRoles={ROLES.Client} />}>
          <Route path="paciente" element={<Paciente />} />
          <Route path="pacientes/diagnostico/:id" element={<PacienteDiagnostico />} />
        </Route>
        <Route />
      </Route>
    </Routes>
  );
}

export default App;
