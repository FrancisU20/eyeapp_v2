//Importar la conexion a la base de datos
const pool = require("../db");

//Controlador para obtener usuarios
const ObtenerEmpleados = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios where roles_id_rol = 2");
  res.json(result.rows);
    
  } catch (error) {
    res.sendStatus(400);
  }
};


//Exportar controladores
module.exports = {
  ObtenerEmpleados,
};
