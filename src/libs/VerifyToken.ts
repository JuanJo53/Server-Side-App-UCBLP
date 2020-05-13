import{Request,Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface IPayload{
    id:string;
    expiresIn:number;
}

export const TokenValidation =(req:Request,res:Response, next:NextFunction)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).json('Acceso denegado');

    const payload= jwt.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest') as IPayload;
    req.docenteId=payload.id;
    console.log("ID doc:"+payload);

    next();
}
