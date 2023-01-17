//Importar Librerias
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

//Importar Rutas
const usuarioRoutes = require("./routes/usuarios.routes");
const loginRoutes = require("./routes/login.routes");
const diagnosticoRoutes = require("./routes/diagnosticos.routes");
const pacienteRoutes = require("./routes/pacientes.routes");
const empleadosRoutes = require("./routes/empleados.routes");

//Inicializar
const app = express();
const port = 4001;

app.use(bodyParser.json({ limit: "512mb" }));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    exposedHeaders: ["Content-Length", "Content-Type"],
    maxAge: 12000000,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204,
    preflightContinue: true,
  })
);

//app.use(cors({  }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use("/api", loginRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/diagnosticos", diagnosticoRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/empleados", empleadosRoutes); 

app.listen(port, () => console.log(`Backend listening on port ${port}!`));
