import { Router } from "express"
import multer  from 'multer';
import {getProductos,getProductosxid,postProductos,putProductos,patchProductos,deleteProductos} from  '../controladores/productosCtrl.js'

//CONFIGURACION MULTER PARA ALMACENAR IMAGENES
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads');//CARPETA DONDE GUARDARAN LAS IMAGENES
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload=multer({storage});
const router=Router()
// ARMAR RUTAS
router.get('/productos',getProductos) //SELECT
router.get('/productos/:id',getProductosxid) //SELECT POR ID
router.post('/productos',upload.single('image'),postProductos) //INGRESAR NUEVO PRODUCTO
router.put('/productos/:id',upload.single('image'),putProductos) //MODIFICAR PRODUCTO
router.patch('/productos/:id',upload.single('image'),patchProductos)//MODIFICAR PRODUCTO ESPECIFICO
router.delete('/productos/:id',deleteProductos) //BORRAR PRODUCTO

export default router 