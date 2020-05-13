import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../Database'; 
class LoginController{ 
    private criptPass(password:string):string{
        const salt= bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password,salt);
    }
    private  valPass(password:string,passwordBd:string,):boolean{
        const ver=bcrypt.compareSync(password,passwordBd);
        return ver; 
    }
    private getToken(login_id:string):string{
        return jwt.sign(login_id,process.env.TOKEN_SESION_PLAT||"TOKEN_PRUEBA");
    }
    //Validar inicio de sesión 
    //Para probarlo utiliza este json : {"correo_docente":"m.ticona@acad.ucb.edu.bo","contrasenia_docente":"1234abc"}
    public async validarUsuario (req:Request,res:Response){ 
        //Guardamos el correo y la contraseña en variables
        const correoDocente = req.body.correo_docente; 
        const contraseniaDocente = req.body.contrasenia_docente ;
        const query =`SELECT  id_docnete FROM docente WHERE  estado_docente = true 
                      AND correo_docente = ?`;
        await Db.query(query, [correoDocente],function(err, result, fields) {
            if (err) throw err;
            //Si el resultado retorna un docente con esos datos se valida el ingreso
            if(result.length>0){

                if(loginController.valPass(contraseniaDocente,result[0].contrasenia_docente))
                {
                    const token=loginController.getToken(req.body.correo_docente);
                    res.json(token);    
                }   
                else{
                    res.json({text: "Usuario no validado"});
                }
            }
            else{
                res.json({text: "Usuario no validado"});
                
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
        const {id} = req.params;
        await Db.query('SELECT * FROM docente WHERE estado_docente=true AND id_docente=? ',[id], function(err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
    //Registrar un nuevo docente
    public async registrarDocente (req:Request,res:Response){ 
        req.body.contrasenia_docente=loginController.criptPass(req.body.contrasenia_docente);
        await Db.query('INSERT INTO docente set ?', [req.body],function(err, result, fields) {
            if (err) throw err;
            const token=loginController.getToken(req.body.correo_docente)
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