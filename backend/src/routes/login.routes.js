//Importar Librerias
const { Router } = require("express");
const router = Router();

//Importar Controladores
const {
  Login,
} = require("../controllers/login.controllers");

//Login de usuario
router.post("/login", Login);

module.exports = router;
