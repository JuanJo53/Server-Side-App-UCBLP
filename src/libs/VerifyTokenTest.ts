import{Request,Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface Practica{
    id:number;
    expiresIn:number;
}

export const TokenValidationTest =(req:Request,res:Response, next:NextFunction)=>{
    const token = req.header('practice');
    console.log("Token: "+token);
    if(token==null) {
        console.log("no definido");
        return res.status(401).json('Acceso denegado');}
    else{
        var practice;
        try{
            practice=jwt.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest') as Practica;
            req.practicaId=practice.id; 
            console.log("Practica:"+practice);
        
            next();
        }
        catch(e){
            console.log("errortoken");
            return res.status(401).json('Acceso denegado');}
        }}
