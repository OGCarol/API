import { Router } from "express"
import {getPedidos,getPedidosxid,postPedidos,putPedidos,patchPedidos,deletePedidos} from  '../controladores/pedidosCtrl.js'
const router=Router()
// armar nuestras rutas

router.get('/Pedidos',getPedidos)//select
router.get('/pedidos/:id',getPedidosxid)//select por ID
router.post('/pedidos',postPedidos) //inserta nuevo
router.put('/pedidos/:id',putPedidos) //update modifica todo
router.patch('/pedidos/:id',patchPedidos)//update modifica el especifico
router.delete('/pedidos/:id',deletePedidos) //delete

export default router 