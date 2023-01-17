//Importar la conexion a la base de datos
const pool = require("../db");

//Controlador para obtener pacientes
const ObtenerPacientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT id_paciente, cedula_paciente, nombre_paciente, apellido_paciente, TO_CHAR(nac_paciente,'YYYY-MM-DD') as nac_paciente, email_paciente, celular_paciente FROM pacientes");
    res.json(result.rows);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para obtener un paciente
const ObtenerPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT * FROM pacientes WHERE id_paciente = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para crear un paciente
const CrearPaciente = async (req, res) => {
  try {
    const {
      cedula_paciente,
      nombre_paciente,
      apellido_paciente,
      nac_paciente,
      email_paciente,
      celular_paciente,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO pacientes (cedula_paciente, nombre_paciente, apellido_paciente, nac_paciente, email_paciente, celular_paciente) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        cedula_paciente,
        nombre_paciente,
        apellido_paciente,
        nac_paciente,
        email_paciente,
        celular_paciente,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para actualizar un paciente
const ActualizarPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      cedula_paciente,
      nombre_paciente,
      apellido_paciente,
      nac_paciente,
      email_paciente,
      celular_paciente,
    } = req.body;

    const result = await pool.query(
      "UPDATE pacientes SET cedula_paciente = $1, nombre_paciente = $2, apellido_paciente = $3, nac_paciente = $4, email_paciente = $5, celular_paciente = $6 WHERE id_paciente = $7 RETURNING *",
      [
        cedula_paciente,
        nombre_paciente,
        apellido_paciente,
        nac_paciente,
        email_paciente,
        celular_paciente,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para eliminar un paciente
const EliminarPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "DELETE FROM pacientes WHERE id_paciente = $1",
      [id]
    );
    res.json("Paciente " + id + " eliminado");
  } catch (error) {
    res.sendStatus(400);
  }
};

//Exportar controladores
module.exports = {
  ObtenerPacientes,
  ObtenerPaciente,
  CrearPaciente,
  ActualizarPaciente,
  EliminarPaciente,
};
