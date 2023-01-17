//Importar conexion a la base de datos
const pool = require("../db");
const fetch = require("node-fetch");

//Controlador para obtener diagnosticos
const ObtenerDiagnosticos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_diagnostico, TO_CHAR(fecha_diagnostico,'YYYY-MM-DD') as fecha_diagnostico, retino_imagen, usuarios_id_usuario, pacientes_id_paciente, retino_diagnostico, nombre_paciente, apellido_paciente, nickname_usuario FROM diagnosticos D INNER JOIN pacientes P ON D.pacientes_id_paciente = P.id_paciente INNER JOIN usuarios U ON D.usuarios_id_usuario = U.id_usuario;"
    );
    res.json(result.rows);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para obtener un diagnostico por id de diagnostico
const ObtenerDiagnostico = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT id_diagnostico, TO_CHAR(fecha_diagnostico,'YYYY-MM-DD') as fecha_diagnostico, retino_imagen, usuarios_id_usuario, pacientes_id_paciente, retino_diagnostico, nombre_paciente, apellido_paciente, nickname_usuario FROM diagnosticos D INNER JOIN pacientes P ON D.pacientes_id_paciente = P.id_paciente INNER JOIN usuarios U ON D.usuarios_id_usuario = U.id_usuario WHERE id_diagnostico = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para obtener un diagnostico por id de diagnostico
const ObtenerDiagnosticosPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT id_paciente, cedula_paciente, nombre_paciente, apellido_paciente, nac_paciente, email_paciente, celular_paciente, id_diagnostico, TO_CHAR(fecha_diagnostico,'YYYY-MM-DD') as fecha_diagnostico, retino_imagen, usuarios_id_usuario, pacientes_id_paciente, retino_diagnostico, nickname_usuario FROM pacientes P INNER JOIN diagnosticos D ON D.pacientes_id_paciente = P.id_paciente INNER JOIN usuarios U ON D.usuarios_id_usuario = U.id_usuario WHERE P.cedula_paciente = $1",
      [id]
    );
    if(result.rows.length > 0){
      res.json(result.rows);
    }
    else{
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para crear un diagnostico
const CrearDiagnostico = async (req, res) => {
  try {
    const { usuarios_id_usuario, pacientes_id_paciente, retino_imagen } =
      req.body;
    const result = await fetch("http://127.0.0.1:5000/api/predicciones", {
      method: "POST",
      body: JSON.stringify({
        usuarios_id_usuario: usuarios_id_usuario,
        pacientes_id_paciente: pacientes_id_paciente,
        retino_imagen: retino_imagen,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.send(result);
    console.log(result);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Controlador para eliminar un diagnostico
const EliminarDiagnostico = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "DELETE FROM diagnosticos WHERE id_diagnostico = $1",
      [id]
    );
    res.json("Usuario " + id + " eliminado");
  } catch (error) {
    res.sendStatus(400);
  }
};

//Exportar controladores
module.exports = {
  ObtenerDiagnosticos,
  ObtenerDiagnostico,
  ObtenerDiagnosticosPaciente,
  CrearDiagnostico,
  EliminarDiagnostico,
};
