//Importar Librerias
const jwt = require("jsonwebtoken");

//Funcion para generar el token
const tokenSign = async (user) => {
  return jwt.sign(
    {
      id: user.id_usuario,
      rol: user.roles_id_rol,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}

//Funcion para verificar el token
const tokenVerify = async (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = { tokenSign, tokenVerify };