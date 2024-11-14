import{conmysql} from '../db.js'

export const getPedidos=
    async (req,res)=>{
        try {
            const [result]=await conmysql.query(' select * from pedidos')
            res.json(result)
        } catch (error) {
            return res.status(500).json({message:"Error al consultar pedidos"})       
        }   
    }
//  CAMPOS:  ped_id, cli_id, ped_fecha, usr_id, ped_estado


export const getPedidosxid= 
async (req,res)=>{
    try {
        const [result]=await conmysql.query('select * from pedidos where ped_id=?',[req.params.id])
        if(result.length<=0)return res.status(404).json({
            ped_id:0,
            message:"Pedido no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'Error del lado del servidor'})
    }
}/*get para seleccionar*/

export const postPedidos=
async (req,res)=>{
try {
    //console.log(req.body)
    const {cli_id, ped_fecha, usr_id, ped_estado}=req.body
    //console.log(cli_nombre)   
    const [rows]=await conmysql.query('insert into pedidos (cli_id, ped_fecha, usr_id, ped_estado) values(?,?,?,?)',
        [cli_id, ped_fecha, usr_id, ped_estado])
        //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) values(?,?)',[cli_nombre,cli_correo])
    res.send({
        id:rows.insertId
    })
    
} catch (error) {
    return res.status(500).json({message:'error del lado del servidor'})
}

}/*post es para crear*/

export const putPedidos= 
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {cli_id, ped_fecha, usr_id, ped_estado}=req.body
        console.log(usr_id)   
        const [result]=await conmysql.query('update pedidos set cli_id=?, ped_fecha=?, usr_id=?, ped_estado=? where ped_id=?',
            [cli_id, ped_fecha, usr_id, ped_estado,id])
            //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) where cli_id=4,[cli_nombre,cli_correo])
         
         if(result.affectedRows<=0)return res.status(404).json({message:'Pedido no encontrado'})
         const [rows]=await conmysql.query('select * from pedidos where ped_id=?',[id])
         res.json(rows[0])
        /*    res.send({
            id:rows.insertId
        })*/        
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
    
    }/*put para reemplazar*/

export const patchPedidos= 
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {cli_id, ped_fecha, usr_id, ped_estado}=req.body
        console.log(ped_fecha)
        //    IFNULL en cada campo para que se mantega lo que ya estaba en caso de no llenar ese campo manualmente
        const [result]=await conmysql.query('update pedidos set cli_id=IFNULL(?,cli_id), ped_fecha=IFNULL(?,ped_fecha), usr_id=IFNULL(?,usr_id), ped_estado=IFNULL(?,ped_estado) where ped_id=?',
            [cli_id, ped_fecha, usr_id, ped_estado,id])
            //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) where cli_id=4,[cli_nombre,cli_correo])
         
         if(result.affectedRows<=0)return res.status(404).json({message:'Pedido no encontrado'})
         const [rows]=await conmysql.query('select * from pedidos where ped_id=?',[id])
         res.json(rows[0])
        /*    res.send({
            id:rows.insertId
        })*/        
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
    
    }//patch para modificar

export const deletePedidos= 
async (req,res)=>{
    try {
        const [row]=await conmysql.query('delete from pedidos where ped_id=?',[req.params.id])
        if(row.affectedRows<=0)return res.status(404).json({
            id:0,
            message:"NO pudo eliminar al cliente"
        })
        res.sendStatus(202)
    } catch (error) {
        return res.status(500).json({message:"Error del lado del servidor"})
    }

}//delete para eliminar