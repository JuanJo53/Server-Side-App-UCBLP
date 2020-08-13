import{Request,Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { Practica } from 'model/Practica';


export const TokenValidationTest =(req:Request,res:Response, next:NextFunction)=>{
    console.log(req.headers)
    const token = req.header('token_prac');
    console.log("Token: "+token);
    if(token==null) {
        console.log("no definido");
        return res.status(500).json('Acceso denegado');}
    else{
        var practice;
        try{
            practice=jwt.verify(token, process.env.TOKEN_PRACTICA || 'tokentest') as Practica;
            req.practicaId=practice.id; 
            const tiempo=(practice.exp-Math.round(Date.now()/1000))-60;
            const minutos=Math.floor(tiempo/60);
            const segundos=tiempo-minutos*60;
            const tiempoRes={minutos:minutos,segundos:segundos}
            console.log(tiempoRes);
            req.tiempoPractica= tiempoRes;
        
            next();
        }
        catch(e){
            console.log(e);
            console.log("errortoken");
            return res.status(500).json('Acceso denegado');}
        }}
