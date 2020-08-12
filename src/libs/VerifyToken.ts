import{Request,Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface IPayload{
    id:string;
    tipo:string;
    expiresIn:number;
}

export const TokenValidation =(req:Request,res:Response, next:NextFunction)=>{
    const token = req.header('authorization');
    console.log("Token: "+token);
    if(token==null) {
        console.log("no definido");
        return res.status(401).json('Acceso denegado');}
    else{
        try{
            const payload= jwt.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest') as IPayload;
            if(payload.tipo=="docente"){
                req.docenteId=payload.id; 
                console.log("ID doc:"+payload);
            }
            else{
                return res.status(401).json('Acceso denegado');}
        
            next();
        }
        catch(e){
            console.log("errortoken");
            return res.status(401).json('Acceso denegado');

        }
    }
}
