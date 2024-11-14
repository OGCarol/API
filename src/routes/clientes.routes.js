import { Router } from "express"
import {getClientes,getclientesxid,postCliente,putCliente,patchCliente,deleteCliente} from  '../controladores/clientesCtrl.js'
const router=Router()
// armar nuestras rutas

router.get('/Clientes',getClientes)//select
router.get('/clientes/:id',getclientesxid)//select por ID
router.post('/clientes',postCliente) //inserta nuevo
router.put('/clientes/:id',putCliente) //update modifica todo
router.patch('/clientes/:id',patchCliente)//update modifica el especifico
router.delete('/clientes/:id',deleteCliente) //delete

export default router 