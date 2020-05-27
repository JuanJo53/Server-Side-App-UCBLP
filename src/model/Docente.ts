
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../Database'; 
export class Docente{
    id_docente:number;
    nombre_docente:string;
    ap_pat_docente:string;
    ap_mat_docente:string;
    correo_docente:string;
    contrasenia_docente:string;
    estado_docente:string;
    criptPass(){
        const salt= bcrypt.genSaltSync(10);
        this.contrasenia_docente= bcrypt.hashSync(this.contrasenia_docente,salt);
    }
    valPass(password:string):boolean{
        const ver=bcrypt.compareSync(password,this.contrasenia_docente);
        return ver; 
    }
    getToken():string{
        return jwt.sign({id:this.id_docente},process.env.TOKEN_SESION_PLAT||"TOKEN_PRUEBA",{expiresIn:60*60*24});
    }
}