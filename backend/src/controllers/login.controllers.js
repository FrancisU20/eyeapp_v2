//Importar la conexion a la base de datos
const pool = require("../db");

//Importar la funcion para comparar la contraseña
const { comparePassword } = require("../helpers/handleBcrypt");

//Importar la funcion para generar el token
const { tokenSign } = require("../helpers/generateToken");

//Controlador de login
const Login = async (req, res) => {
  const { nickname_usuario, contrasena_usuario } = req.body;

  const result = await pool.query(
    "SELECT * FROM usuarios WHERE nickname_usuario = $1",
    [nickname_usuario]
  );

  if (result.rows.length > 0) {
    const user = result.rows[0];
    const validPassword = await comparePassword(
      contrasena_usuario,
      user.contrasena_usuario
    );
    const tokenSession = await tokenSign(user);
    if (validPassword) {
      res.send({
        rol: user.roles_id_rol,
        token: tokenSession,
      });
      return;
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(402);
  }
};

module.exports = { Login };
