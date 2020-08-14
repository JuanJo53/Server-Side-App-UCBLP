
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Practica } from '../model/Practica';
import { toInt } from 'validator';
export class TokenService{
    criptPass(password:string):string{
        const salt= bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password,salt);
    }
    valPass(password:string,passwordBd:string,):boolean{ 
        const ver=bcrypt.compareSync(password,passwordBd);
        return ver; 
    }
    getToken(login_id:string,tipo:string):string{
        return jwt.sign({id:login_id,tipo:tipo},process.env.TOKEN_SESION_PLAT||"TOKEN_PRUEBA",{expiresIn:60*60*24});
    }
    getTokenPracticeTiempo(idPractica:number,expiracion:number){
        return jwt.sign({id:idPractica},process.env.TOKEN_PRACTICA||"TOKEN_PRUEBA",{expiresIn:expiracion});
    }
    getTokenPractice(idPractica:number){
        return jwt.sign({id:idPractica},process.env.TOKEN_PRACTICA||"TOKEN_PRUEBA");
    }
    revisarTokenPractica(token:string){
        console.log("Token: "+token);
        if(token==null) {
            console.log("no definido");
            return false}
        else{
            var practice;
            try{
                practice= jwt.verify(token, process.env.TOKEN_PRACTICA|| 'tokentest') as Practica;
                console.log(practice);
                console.log(Date.now());
                console.log(practice);
                const tiempo=(practice.exp-Math.round(Date.now()/1000))-60;
                const minutos=Math.floor(tiempo/60);
                const segundos=tiempo-minutos*60;
                const tiempoRes={minutos:minutos,segundos:segundos}
                console.log(tiempoRes);
                return tiempoRes;
            }
            catch(e){
                console.log("errortoken");
                return false;
            }
        }
    }
    
}