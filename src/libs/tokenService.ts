
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export class TokenService{
    criptPass(password:string):string{
        const salt= bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password,salt);
    }
    valPass(password:string,passwordBd:string,):boolean{ 
        const ver=bcrypt.compareSync(password,passwordBd);
        return ver; 
    }
    getToken(login_id:string):string{
        return jwt.sign({id:login_id},process.env.TOKEN_SESION_PLAT||"TOKEN_PRUEBA",{expiresIn:60*60*24});
    }
}