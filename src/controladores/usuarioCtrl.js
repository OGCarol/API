import jwt from 'jsonwebtoken';
import { conmysql } from '../db.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

export const getUsuarios=
    async (req,res) =>{
        try {
            const [result]= await conmysql.query(' select * from usuarios')
            res.json(result)
        } catch (error) {
            return res.status(500).json({message:"Error al consultar Usuarios"})
        }
    }


    export const getUsuariosxid= 
    async (req,res)=>{
        try {
            const [result]=await conmysql.query('select * from usuarios where usr_id=?',[req.params.id])
            if(result.length<=0)return res.status(404).json({
                id: 0,
                message:"Usuarios no encontrado"
            })
            res.json(result[0])
        } catch (error) {
            return res.status(500).json({message:'Error del lado del servidor'})
        }
    }/*get para seleccionar*/
    
    export const postUsuarios=
    async (req,res)=>{
    try {
        //console.log(req.body)
        const {usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo}=req.body

        // Encripta la contraseña
        const saltin = await bcrypt.genSalt(10); // El número 10 indica la complejidad del "salting"
        const encriptada = await bcrypt.hash(usr_clave, saltin);
        const [fila] = await conmysql.query('Select * from usuarios where usr_usuario=?', [usr_usuario])
          
          if (fila.length >0) return res.status(404).json({
            id: 0,
            messge: 'El suario : '+ usr_usuario+' ya está registrado'
        })
        // Insertar el usuario con la contraseña encriptada: 
        const [rows] = await conmysql.query('insert into usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) values(?,?,?,?,?,?)',
        [usr_usuario, encriptada, usr_nombre, usr_telefono, usr_correo, usr_activo]
        );
        //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) values(?,?)',[usr_nombre,usr_telefono])

        res.send({
            id:rows.insertId
        })
        
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
    
    }/*post es para crear*/


    export const putUsuarios = async(req, res) => {
        try {
            const { id } = req.params;
            const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

            // Verifica usuario si existe
            const [usarioexiste] = await conmysql.query('select usr_clave from usuarios WHERE usr_id = ?', [id]);
            if (!usarioexiste || usarioexiste.length === 0) {
                return res.status(400).json({ message: "Usuario no encontrado" });
            }
            //mantiene la misma clave si no se ha modificado
            let nuevaClave = usarioexiste[0].usr_clave; 

            //encripta claves nuevas
            if (usr_clave && usr_clave !== nuevaClave) {
                const salt = await bcrypt.genSalt(10);
                nuevaClave = await bcrypt.hash(usr_clave, salt);
            }

            const [result] = await conmysql.query('update usuarios set usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? WHERE usr_id=?',
                [usr_usuario, nuevaClave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
            );

            if (result.affectedRows <= 0) {
                return res.status(400).json({ message: "Error al actualizar el usuario" });
            }

            // Usuario Actualizado
            const [rows] = await conmysql.query('select * from usuarios where usr_id=?', [id]);
            res.json(rows[0]);

        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }/*put para reemplazar*/
    
    export const patchUsuarios= 
    async (req,res)=>{
        try {
            const {id}=req.params
            //console.log(req.body)
            const {usr_usuario, nuevaClave, usr_nombre, usr_telefono, usr_correo, usr_activo}=req.body
            console.log(usr_nombre)
            //    IFNULL en cada campo para que se mantega lo que ya estaba en caso de no llenar ese campo manualmente
            const [result]=await conmysql.query('update usuarios set usr_usuario=IFNULL(?,usr_usuario), usr_clave=IFNULL(?,usr_clave), usr_nombre=IFNULL(?,usr_nombre), usr_telefono=IFNULL(?,usr_telefono), usr_correo=IFNULL(?,usr_correo), usr_activo=IFNULL(?,usr_activo) where usr_id=?',
                [usr_usuario, nuevaClave, usr_nombre, usr_telefono, usr_correo, usr_activo,id])
                //EJEMPLO: const [rows]=await conmysql.query('insert  into table(cam1,cam2) where cli_id=4,[cli_nombre,cli_correo])
             
             if(result.affectedRows<=0)return res.status(404).json({message:'Usuario no encontrado'})
             const [rows]=await conmysql.query('select * from usuarios where usr_id=?',[id])
             res.json(rows[0])
            /*    res.send({
                id:rows.insertId
            })*/        
        } catch (error) {
            return res.status(500).json({message:'error del lado del servidor'})
        }
        
        }//patch para modificar
    
    export const deleteUsuarios= 
    async (req,res)=>{
        try {
            const [row]=await conmysql.query('delete from usuarios where usr_id=?',[req.params.id])
            if(row.affectedRows<=0)return res.status(404).json({
                message:("No pudo eliminar el usuario")
            })
            res.json({
                id: 1,
                messge:'usuario Eliminado con éxito :)'
            })
        } catch (error) {
            return res.status(500).json({ message: 'somenting goes wrong' })
        }
    
    }//delete para eliminar

    
    
    // Codigo para inicio de sesion y obtener token
    export const loginUsuario =  async (req, res) => {
        const { usr_usuario, usr_clave } = req.body;
    
        try {
            // BUSCA AL USUARIO EN BASE DE DATO
            const [user] = await conmysql.query('select * from usuarios where usr_usuario = ?', [usr_usuario]);
    
            if (user.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    
            // VERIFICACION DE CONTRASEÑA
            const Validarcontraseña = await bcrypt.compare(usr_clave, user[0].usr_clave);
            if (!Validarcontraseña) return res.status(401).json({ message: 'Contraseña incorrecta' });
    
            // CREACION DEL TOKEN
            const token = jwt.sign({ id: user[0].id, usr_usuario: user[0].usr_usuario }, JWT_SECRET, {
                expiresIn: '1h' // TIEMPO DE EXPIRACION DEL TOKEN
            });
    
            res.json({ message: 'Autenticación exitosa', token });
        } catch (error) {
            res.status(500).json({ message: 'Error en la autenticación', error });
        }
    };