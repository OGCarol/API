import{conmysql} from '../db.js'

export const getPedidos_detalle=
    async (req,res)=>{
        try {
            const [result]=await conmysql.query(' select * from pedidos_detalle')
            res.json(result)
        } catch (error) {
            return res.status(500).json({message:"Error al consultar detalle"})       
        }   
    }
//  det_id, prod_id, ped_id, det_cantidad, det_precio


export const getPedidos_detallexid= 
async (req,res)=>{
    try {
        const [result]=await conmysql.query('select * from pedidos_detalle where det_id=?',[req.params.id])
        if(result.length<=0)return res.status(404).json({
            det_id:0,
            message:"Detalle no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'Error del lado del servidor'})
    }
}/*get para seleccionar*/

export const postPedidos_detalle = async (req, res) => {
  try {
    const detalles = req.body; // Suponiendo que req.body es un array de objetos detalle

    // Valida que detalles sea un array
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ message: 'Detalles no válidos' });
    }

    // Ejecuta la inserción para cada detalle en la lista
    for (const detalle of detalles) {
      const { prod_id, ped_id, det_cantidad, det_precio } = detalle;

      await conmysql.query(
        'INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
        [prod_id, ped_id, det_cantidad, det_precio]
      );
    }

    res.send({ message: 'Detalles guardados con éxito' });
  } catch (error) {
    console.error('Error del lado del servidor:', error);
    return res.status(500).json({ message: 'Error del lado del servidor' });
  }
};

export const putPedidos_detalle= 
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {prod_id, ped_id, det_cantidad, det_precio}=req.body
        console.log(ped_id)   
        const [result]=await conmysql.query('update pedidos_detalle set prod_id=?, ped_id=?, det_cantidad=?, det_precio=? where det_id=?',
            [prod_id, ped_id, det_cantidad, det_precio,id])
            //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) where cli_id=4,[cli_nombre,cli_correo])
         
         if(result.affectedRows<=0)return res.status(404).json({message:'Detalle no encontrado'})
         const [rows]=await conmysql.query('select * from pedidos_detalle where det_id=?',[id])
         res.json(rows[0])
        /*    res.send({
            id:rows.insertId
        })*/        
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
    
    }/*put para reemplazar*/

export const patchPedidos_detalle= 
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {prod_id, ped_id, det_cantidad, det_precio}=req.body
        console.log(ped_id)
        //    IFNULL en cada campo para que se mantega lo que ya estaba en caso de no llenar ese campo manualmente
        const [result]=await conmysql.query('update pedidos_detalle set prod_id=IFNULL(?,prod_id), ped_id=IFNULL(?,ped_id), det_cantidad=IFNULL(?,det_cantidad), det_precio=IFNULL(?,det_precio) where det_id=?',
            [prod_id, ped_id, det_cantidad, det_precio,id])
            //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) where cli_id=4,[cli_nombre,cli_correo])
         
         if(result.affectedRows<=0)return res.status(404).json({message:'Detalle no encontrado'})
         const [rows]=await conmysql.query('select * from pedidos_detalle where det_id=?',[id])
         res.json(rows[0])
        /*    res.send({
            id:rows.insertId
        })*/        
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
    
    }//patch para modificar

export const deletePedidos_detalle= 
async (req,res)=>{
    try {
        const [row]=await conmysql.query('delete from pedidos_detalle where det_id=?',[req.params.id])
        if(row.affectedRows<=0)return res.status(404).json({
            id:0,
            message:"NO pudo eliminar al cliente"
        })
        res.sendStatus(202)
    } catch (error) {
        return res.status(500).json({message:"Error del lado del servidor"})
    }

}//delete para eliminar