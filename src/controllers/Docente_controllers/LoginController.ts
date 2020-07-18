import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../../Database'; 
import { TokenService } from '../../libs/tokenService';
class LoginController{ 
    
    //Validar inicio de sesión 
    //Para probarlo utiliza este json : {"correo_docente":"m.ticona@acad.ucb.edu.bo","contrasenia_docente":"1234abc"}
    public async validarDocente (req:Request,res:Response){ 
        //Guardamos el correo y la contraseña en variables
        const tokenService=new TokenService();
        console.log(req.headers);
        const correoDocente:string = req.body.correoDocente; 
        const contraseniaDocente:string = req.body.contraseniaDocente;
        console.log("Correo: "+correoDocente);
        console.log("Contra: "+contraseniaDocente);
        const query =`SELECT  id_docente, correo_docente,contrasenia_docente FROM docente WHERE  estado_docente = true 
                      AND correo_docente = ?`;
        await Db.query(query,[correoDocente],function(err, result, fields) {
            if (err) throw err;
            //Si el resultado retorna un docente con esos datos se valida el ingreso
            
            if(result.length>0){
                if(tokenService.valPass(contraseniaDocente,result[0].contrasenia_docente))
                {
                    
                    const token=tokenService.getToken(result[0].id_docente);
                    console.log("Token: "+token);
                    res.json(
                        {
                          //  user:correoDocente,
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
    //Listar docentes activos
    public async listarDocentes (req:Request,res:Response){ 
       const  query = `SELECT id_docente,nombre_docente,ap_pat_docente, ap_mat_docente, correo_docente,
       contrasenia_docente FROM docente where estado_docente =true;`;
        await Db.query(query, function(err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
    public async listarDocente(req:Request,res:Response){ 
        const id = req.docenteId;
        console.log("ID: "+id);
        const  query = `SELECT nombre_docente,ap_pat_docente, ap_mat_docente, correo_docente
        FROM docente where estado_docente =true AND id_docente = ?`;
        await Db.query(query,[id], function(err, result, fields) {
            if (err) throw err;
            res.json(result[0]);
            //console.log()
        });
    }
    //Registrar un nuevo docente
    public async registrarDocente (req:Request,res:Response){ 
        const tokenService=new TokenService();
        req.body.contraseniaDocente=tokenService.criptPass(req.body.contraseniaDocente);
         Db.query('INSERT INTO docente set ?', [req.body],function(err, result, fields) {
            if (err) throw err;
            const token=tokenService.getToken(req.body.correoDocente)
            res.json(token);  
        });
    }
    //Eliminar un docente
    public async eliminarDocente (req:Request,res:Response){ 
        const {id} = req.params;
        await Db.query('UPDATE docente SET estado_docente = false WHERE id_docente = ?',[id],function(err, result, fields) {
            if (err) throw err;
            res.json({text: 'Eliminando docente'});
        });
    }

}
export const loginController=new LoginController();