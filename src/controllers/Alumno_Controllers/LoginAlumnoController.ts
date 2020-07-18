import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../../Database'; 
import { TokenService } from '../../libs/tokenService';

class LoginAlumnoController{

    public async registrarAlumno (req:Request,res:Response){ 
        const tokenService=new TokenService();
        req.body.contraseniaDocente=tokenService.criptPass(req.body.contraseniaDocente);
         Db.query('INSERT INTO alumno set ?', [req.body],function(err, result, fields) {
            if (err) throw err;
            const token=tokenService.getToken(req.body.correoDocente)
            res.json(token);  
        });
    }
    public async actucalizarContraseniaAlumno (req:Request,res:Response){
        const tokenService = new TokenService();
        const {id}=req.params;
        const query = 'UPDATE alumno SET contrasenia_alumno = ? WHERE id_alumno = ?';
        Db.query(query,[tokenService.criptPass(req.body.conraseniaAlumno),id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error'});
                throw err;
            }
            else{
                res.status(200).json({text:'Contrasenia actualizada'});
            }
        });

    }
}

export const loginAlumnoController=new LoginAlumnoController();