import express from  'express'
import cors from 'cors';//imoorta los paquetes cors--permite permisos--- politicas de seguridad
import path from 'path';//captura la ruta donde esta la carpeta
import { fileURLToPath } from 'url';//captura los archivos donde se va almacenando
import clientesRoutes from './routes/clientes.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import productosRoutes from './routes/productos.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import pedidos_detallesRoutes from './routes/pedidos_detalle.routes.js'

//deifinir modulo ES
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const app=express();
const corsOption={
    origin:'*',//la direccion ip(del dominio) del servidor
    methods:['GET','POST','PUT', 'PATCH', 'DELETE'],
    credentials:true
}
app.use(cors(corsOption));
app.use(express.json());//para que interprete los objetos .json
app.use(express.urlencoded({extended:true}));//se añade para poder receptar formularios
app.use('/uploads',express.static(path.join(__dirname,'../uploads')));

//rutas
app.use('/api',clientesRoutes)
app.use('/api',usuariosRoutes)
app.use('/api',productosRoutes)
app.use('/api',pedidosRoutes)
app.use('/api',pedidos_detallesRoutes)

app.use((req,res,next)=>{
    res.status(400).json({
        message:' Endpoint not found'
    })
})
export default app;