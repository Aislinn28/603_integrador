import "rootpath"; 
import express from "express"; 
import cors from "cors"; 
import morgan from "morgan"; 
import bodyParser from "body-parser"; 
import path from "path";
import { fileURLToPath } from "url";

//Archivos de configuracion propios 
import config from "./middlewares/config.mjs"; 
import errorHandler from "./middlewares/error-handler.mjs"; 

// Controladores
import UsuarioController from "./controllers/usuario.controller.mjs";
import VehiculoController from "./controllers/vehiculos.controller.mjs"; // NUEVO
import dotenv from 'dotenv';
import ReservaController from "./controllers/reservas.controller.mjs";

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// se instancia el servidor 
const app = express(); 
dotenv.config();

//libreria en tiempo de desarrollo para poder ver el tipo de peticion que te estan mandando 
app.use(morgan("dev")); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

// CORS actualizado para producción y desarrollo
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-app-name.azurewebsites.net'] // Cambia por tu URL real de Azure
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'usuario_id'],
  credentials: true,
})); 

// Servir archivos estáticos del frontend (Vue.js)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API (mantén el prefijo /api para diferenciar)
app.use("/api/usuario", UsuarioController);
app.use("/api/vehiculos", VehiculoController);
app.use("/api/reservas", ReservaController);

// Middleware de manejo de errores
app.use(errorHandler); 

// Catch-all handler: sirve el index.html de Vue para todas las rutas no API
// IMPORTANTE: esto debe ir DESPUÉS de todas las rutas de API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// inicia el servidor 
const PORT = process.env.PORT || config.PORT;
app.listen(PORT, function () { 
  console.log("Server listening on port ", PORT); 
});