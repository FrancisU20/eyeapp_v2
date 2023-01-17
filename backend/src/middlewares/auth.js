// Importar las librerias
const { tokenVerify } = require("../helpers/generateToken");

// Funcion para verificar la autenticacion
const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await tokenVerify(token);
    if (tokenData.id) {
      next();
    } else {
      res.status(401).send("Acceso no autorizado");
    }
  } catch (e) {
    res.status(401).json("Acceso no autorizado");
  }
};

// Exportar la funcion
module.exports = { checkAuth };
