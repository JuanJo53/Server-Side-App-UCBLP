import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import Db from '../../Database'; 
import { TokenService } from '../../libs/tokenService';
import util from 'util'

class LoginAlumnoController{
    public async perfilAlumno (req:Request,res:Response){
        const id=req.estudianteId;
        const  query = `SELECT nombre_alumno,ap_paterno_alumno, ap_materno_alumno, correo_alumno
        FROM alumno where estado_alumno =true AND id_alumno = ?`;
        try{
            const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            var row =await result2(query,[id]) as any[];
            console.log(row);
            res.status(200).json(row);
            
        }
        catch(e){
            console.log(e);
            res.status(500).json({text:'Error al obtener perfil.'});

        }

    }
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