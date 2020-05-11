import{Request,Response} from 'express';
import Db from '../Database';
class LoginController{
    //Validar inicio de sesión 
    public async login (req:Request,res:Response){ 
        //Guardamos el correo y la contraseña en variables
        const correoDocente = req.body.correo_docente;
        const contraseniaDocente = req.body.contrasenia_docente ;
        const query =`SELECT  * FROM docente WHERE  estado_docente = true 
                      AND correo_docente = '${correoDocente}' AND contrasenia_docente = '${contraseniaDocente}'`;
        await Db.query(query, function(err, result, fields) {
            if (err) throw err;
            //Si el resultado retorna un docente con esos datos se valida el ingreso
            if(result.length>0){
                res.json({text: "Usuario validado"});
            }
            else{
                res.json({text: "Usuario no validado"});
            }
           
        });
    }
    //Listar docentes activos
    public async listarDocentes (req:Request,res:Response){ 
        await Db.query('SELECT * FROM docente WHERE estado_docente = true', function(err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
}
export const loginController=new LoginController();