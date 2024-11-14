import { Router } from "express";
import { getUsuarios, getUsuariosxid, postUsuarios, putUsuarios, patchUsuarios, deleteUsuarios, loginUsuario } from '../controladores/usuarioCtrl.js';
import { verifyToken } from '../seguridad/seguridad.js';

const router = Router();

router.get('/usuarios',verifyToken, getUsuarios); // Protegido con JWT
router.get('/usuarios/:id', verifyToken, getUsuariosxid); // Protegido con JWT
router.post('/usuarios', postUsuarios); // Crear nuevo usuario (sin protección JWT)
router.put('/usuarios/:id', verifyToken, putUsuarios); // Protegido con JWT
router.patch('/usuarios/:id', verifyToken, patchUsuarios); // Protegido con JWT
router.delete('/usuarios/:id', verifyToken, deleteUsuarios); // Protegido con JWT

router.post('/loginUsr', loginUsuario); // Ruta pública para iniciar sesión y obtener el token

export default router;
