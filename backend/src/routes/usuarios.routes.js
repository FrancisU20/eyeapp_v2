//Importar Librerias
const { Router } = require("express");
const router = Router();

//Importar Middleware
const { checkAuth } = require("../middlewares/auth");
const { checkRoleAuth } = require("../middlewares/roleAuth");

//Importar Controladores
const {
  ObtenerUsuarios,
  ObtenerUsuario,
  CrearUsuario,
  ActualizarUsuario,
  ActualizarContrasena,
  ActualizarRol,
  EliminarUsuario,
} = require("../controllers/usuarios.controllers");

//Listado de usuarios
router.get("/", checkAuth, checkRoleAuth([1]), ObtenerUsuarios);

//Obtener usuario
router.get("/:id", checkAuth, checkRoleAuth([1]), ObtenerUsuario);

//Crear usuario
router.post("/crear", checkAuth, checkRoleAuth([1]), CrearUsuario);

//Actualizar usuario
router.put("/actualizar/:id", checkAuth, checkRoleAuth([1]), ActualizarUsuario);

//Actualizar contraseña
router.put(
  "/actualizar/contrasena/:id",
  checkAuth,
  checkRoleAuth([1]),
  ActualizarContrasena
);

//Actualizar rol
router.put("/actualizar/rol/:id", checkAuth, checkRoleAuth([1]), ActualizarRol);

//Eliminar usuario
router.delete("/eliminar/:id", checkAuth, checkRoleAuth([1]), EliminarUsuario);

module.exports = router;
