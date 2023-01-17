//Importar Librerias
const bcrypt = require("bcryptjs");

//Funcion para encriptar la contraseña
const encryptPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

//Funcion para comparar la contraseña
const comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

module.exports = { encryptPassword, comparePassword };
