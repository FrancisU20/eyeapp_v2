// Importar controladores
const { ObtenerDiagnosticos, EliminarDiagnostico, CrearDiagnostico, ObtenerDiagnostico, ObtenerDiagnosticosPaciente } = require("../controllers/diagnosticos.controllers");

const { Router } = require("express");

const router = Router();

//Importar Middleware
const { checkAuth } = require("../middlewares/auth");
const { checkRoleAuth } = require("../middlewares/roleAuth");

//Se crea la ruta para obtener diagnosticos
router.get("/", checkAuth, checkRoleAuth([2]), ObtenerDiagnosticos);
//Ruta para obtener un diagnostico
router.get("/ver/:id", checkAuth, checkRoleAuth([2]), ObtenerDiagnostico);
//Ruta para agregar diagnostico
router.post("/crear", checkAuth, checkRoleAuth([2]),CrearDiagnostico);
//Eliminar diagnostico
router.delete("/eliminar/:id", checkAuth, checkRoleAuth([2]), EliminarDiagnostico);
//Ruta para obtener los diagnosticos de un Paciente
router.get("/paciente/:id", ObtenerDiagnosticosPaciente);
//Ruta para obtener un diagnostico
router.get("/paciente/ver/:id", ObtenerDiagnostico);

//Se exporta el modulo
module.exports = router;
