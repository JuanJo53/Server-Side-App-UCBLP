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
            const token=tokenService.getToken(req.body.correoDocente,"alumno");
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
    public async validarAlumno (req:Request,res:Response){ 
        //Guardamos el correo y la contraseña en variables
        const tokenService=new TokenService();
        console.log(req.headers);
        const correoEstudiante:string = req.body.correoEstudiante; 
        const contraseniaEstudiante:string = req.body.contraseniaEstudiante;
        console.log("Correo: "+correoEstudiante);
        console.log("Contra: "+contraseniaEstudiante);
        const query =`SELECT  id_alumno, correo_alumno,contrasenia_alumno FROM alumno WHERE  estado_alumno= true 
                      AND correo_alumno = ?`;
        await Db.query(query,[correoEstudiante],function(err, result, fields) {
            if (err) throw err;
            //Si el resultado retorna un docente con esos datos se valida el ingreso
            
            if(result.length>0){
                if(tokenService.valPass(contraseniaEstudiante,result[0].contrasenia_alumno))
                {
                    
                    const token=tokenService.getToken(result[0].id_alumno,"alumno");
                    console.log("Token: "+token);
                    res.json(
                        {
                            token:token
                        }
                        );   
                        console.log("Entra"); 
                }   
                else{
                    res.json({text: "Usuario no validado"});
                    console.log("No entra por contrasenia");
                }
            }
            else{
                res.json({text: "Usuario no validado"});
                console.log("No entra por correo");
            }
           
        });
    }
}

export const loginAlumnoController=new LoginAlumnoController();