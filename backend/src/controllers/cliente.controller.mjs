import express from "express";
import ClienteService from "../services/cliente.service.mjs";

const router = express.Router();

router.post("/registro", async (req, res, next) => {
  const { usuario, contrasenia } = req.body;

  if (!usuario || !contrasenia) {
    return res.status(400).json({ mensaje: "Usuario y contraseña son obligatorios" });
  }

  try {
    const mensaje = await ClienteService.crearCliente(usuario, contrasenia);
    res.status(201).json({ mensaje });
  } catch (error) {
    next(error);
  }
});

export default router;
