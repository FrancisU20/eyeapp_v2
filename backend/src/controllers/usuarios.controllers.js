//Importar la conexion a la base de datos
const pool = require("../db");

//Importar la funcion para encriptar la contraseña
const { encryptPassword } = require("../helpers/handleBcrypt");

//Controlador para obtener usuarios
const ObtenerUsuarios = async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios");
  res.json(result.rows);
};

//Controlador para obtener un usuario
const ObtenerUsuario = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE id_usuario = $1",
    [id]
  );
  res.json(result.rows[0]);
};

//Controlador para crear un usuario
const CrearUsuario = async (req, res) => {
  try {
    const {
      cedula_usuario,
      nombre_usuario,
      apellido_usuario,
      email_usuario,
      celular_usuario,
      nickname_usuario,
      contrasena_usuario,
      roles_id_rol,
    } = req.body;

    const contrasena_encriptada = await encryptPassword(contrasena_usuario);

    const result = await pool.query(
      "INSERT INTO usuarios (cedula_usuario, nombre_usuario, apellido_usuario, email_usuario, celular_usuario, nickname_usuario, contrasena_usuario, roles_id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        cedula_usuario,
        nombre_usuario,
        apellido_usuario,
        email_usuario,
        celular_usuario,
        nickname_usuario,
        contrasena_encriptada,
        roles_id_rol,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para actualizar un usuario
const ActualizarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      cedula_usuario,
      nombre_usuario,
      apellido_usuario,
      email_usuario,
      celular_usuario,
      nickname_usuario,
      roles_id_rol,
    } = req.body;

    const result = await pool.query(
      "UPDATE usuarios SET cedula_usuario = $1, nombre_usuario = $2, apellido_usuario = $3, email_usuario = $4, celular_usuario = $5, nickname_usuario = $6, roles_id_rol = $7 WHERE id_usuario = $8 RETURNING *",
      [
        cedula_usuario,
        nombre_usuario,
        apellido_usuario,
        email_usuario,
        celular_usuario,
        nickname_usuario,
        roles_id_rol,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para actualizar contraseña de un usuario
const ActualizarContrasena = async (req, res) => {
  try {
    const id = req.params.id;
    const { contrasena_usuario } = req.body;

    const contrasena_encriptada = await encryptPassword(contrasena_usuario);

    const result = await pool.query(
      "UPDATE usuarios SET contrasena_usuario = $1 WHERE id_usuario = $2 RETURNING *",
      [contrasena_encriptada, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para actualizar rol de un usuario
const ActualizarRol = async (req, res) => {
  try {
    const id = req.params.id;
    const { roles_id_rol } = req.body;

    const result = await pool.query(
      "UPDATE usuarios SET roles_id_rol = $1 WHERE id_usuario = $2 RETURNING *",
      [roles_id_rol, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para eliminar un usuario
const EliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1",
      [id]
    );
    res.json("Usuario " + id + " eliminado");
  } catch (error) {
    res.sendStatus(400);
  }
};

//Exportar controladores
module.exports = {
  ObtenerUsuarios,
  ObtenerUsuario,
  CrearUsuario,
  ActualizarUsuario,
  ActualizarContrasena,
  ActualizarRol,
  EliminarUsuario,
};
