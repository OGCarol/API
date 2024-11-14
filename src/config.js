import {config} from 'dotenv'
config()

export const  DB_HOST= process.env.DB_HOST || bckfiq9bemaxuyi3ghue-mysql.services.clever-cloud.com
export const DB_DATABASE=process.env.DB_DATABASE || bckfiq9bemaxuyi3ghue
export const DB_USE=process.env.DB_USE || ucndezni6ht3kw4x
export const DB_PASSWORD=process.env.DB_PASSWORD || 'OIOjDTwYAzLcvT7aURj9'
export const DB_PORT=process.env.DB_PORT || 3306
export const PORT=process.env.PORT || 3000
export const JWT_SECRET = process.env.JWT_SECRET || 'clave';
export const CLOUDINARY_CLOUD_NAME=process.env.CLOUDINARY_CLOUD_NAME || 'API_IMG'
export const CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY || '745176968458949'
export const CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET || 'R9PGPAYcnfWWaF4K_Ij7aDmac9k'