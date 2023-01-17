//Importar Librerias
const { Router } = require("express");
const router = Router();

//Importar Middleware
const { checkAuth } = require("../middlewares/auth");
const { checkRoleAuth } = require("../middlewares/roleAuth");

//Importar Controladores
const {
  ObtenerPacientes,
  ObtenerPaciente,
  CrearPaciente,
  ActualizarPaciente,
  EliminarPaciente,
} = require("../controllers/pacientes.controllers");

//Listado de pacientes
router.get("/", ObtenerPacientes);

//Obtener paciente
router.get("/:id", checkAuth, checkRoleAuth([2]), ObtenerPaciente);

//Crear paciente
router.post("/crear", checkAuth, checkRoleAuth([2]), CrearPaciente);

//Actualizar paciente
router.put(
  "/actualizar/:id",
  checkAuth,
  checkRoleAuth([2]),
  ActualizarPaciente
);

//Eliminar paciente
router.delete("/eliminar/:id", checkAuth, checkRoleAuth([2]), EliminarPaciente);

module.exports = router;
