// Importar las librerias
const { tokenVerify } = require("../helpers/generateToken");
const pool = require("../db");

// Funcion para verificar el rol
const checkRoleAuth = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await tokenVerify(token);
    const userData = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [tokenData.id]
    );

    if ([].concat(roles).includes(userData.rows[0].roles_id_rol)) {
      next();
    } else {
      res.status(401).json("No tiene permisos para realizar esta accion");
    }
  } catch (error) {
    res.status(401).json("No tiene permisos para realizar esta accion");
  }
};

// Exportar la funcion
module.exports = { checkRoleAuth };
