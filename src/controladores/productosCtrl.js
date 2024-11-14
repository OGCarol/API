import { conmysql } from '../db.js';
import { json } from 'express';
import { v2 as cloudinary } from 'cloudinary';

// CONFIGURACION CLOUDINARY
cloudinary.config({
    cloud_name: 'dyyurpyd3',
    api_key: '745176968458949',
    api_secret: 'R9PGPAYcnfWWaF4K_Ij7aDmac9k'
});

//

export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos');
        res.json({ datos: result, message: "La consulta se realizo con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Error al consultar productos" });
    }
};

export const getProductosxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [req.params.id]);
        if (result.length <= 0) return res.status(404).json({
            prod_id: 0,
            message: "Producto no encontrado"
        });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};

export const postProductos = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
        console.log("Datos recibidos del cuerpo:", req.body);

            let prod_imagen=null;
        
        if (req.file){
            console.log("Imagen recibida:",req.file);
            const uploadResult = await cloudinary.uploader.upload(req.file.path,{
                folder: 'uploads',
                public_id:`${Date.now()}-${req.file.originalname}`
            });

            console.log("Resultado de la carga en Cloudinary:", uploadResult);
            prod_imagen=uploadResult.secure_url;
        }else{
            console.log("No se recibio ninguna imagen");
        }

        const [rows] = await conmysql.query('INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES(?,?,?,?,?,?)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        );

        console.log("Producto insertado con ID:",rows.insertId);

        res.status(201).json({
            mensaje:'Producto fuardado correctamente',
            prod_id: rows.insertId,
            prod_imagen: prod_imagen
        });
    }catch(error){
        console.error("Error al crear el producto:", error);
        return res.status(500).json({message:'Error del lado del servidor', error:error.message});
    }

};

export const putProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

        // Inicializar la imagen actual o actualizarla si se envía una nueva
        let newProd_imagen;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads',
                public_id: `${Date.now()}-${req.file.originalname}`
            });

            newProd_imagen = uploadResult.secure_url;
        } else {
            // Obtener la imagen actual si no se envía una nueva
            const [result] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);
            if (result.length > 0) {
                newProd_imagen = result[0].prod_imagen;
            }
        }

        // Actualizar el producto en la base de datos
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, newProd_imagen, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        // Obtener y devolver el producto actualizado
        const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};


export const patchProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

        // Capturar la imagen solo si se ha enviado
        let prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;

        // Si no se envía una nueva imagen, mantener la imagen actual
        if (!prod_imagen) {
            const [result] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);
            if (result.length > 0) {
                prod_imagen = result[0].prod_imagen;
            }
        }

        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo = IFNULL(?, prod_codigo), prod_nombre = IFNULL(?, prod_nombre), prod_stock = IFNULL(?, prod_stock), prod_precio = IFNULL(?, prod_precio), prod_activo = IFNULL(?, prod_activo), prod_imagen = IFNULL(?, prod_imagen) WHERE prod_id = ?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        );

        if (result.affectedRows <= 0){

        } return res.status(404).json({ message: 'Producto no encontrado' });

        const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};

export const deleteProductos = async (req, res) => {
    try {
        const [row] = await conmysql.query('DELETE FROM productos WHERE prod_id=?', [req.params.id]);
        if (row.affectedRows <= 0) return res.status(404).json({
            message: "No pudo eliminar al producto"
        });
        res.json({
            id: 1,
            message: 'Producto eliminado con éxito :)'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar producto' });
    }
};
