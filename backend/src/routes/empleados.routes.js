//Importar Librerias
const { Router } = require("express");
const router = Router();

//Importar Middleware
const { checkAuth } = require("../middlewares/auth");

//Importar Controladores
const {
  ObtenerEmpleados,
} = require("../controllers/empleados.controllers");

//Listado de usuarios
router.get("/", checkAuth, ObtenerEmpleados);

module.exports = router;
