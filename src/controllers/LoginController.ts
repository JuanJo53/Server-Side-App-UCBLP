import{Request,Response} from 'express';
import Db from '../Database';
class LoginController{
    //Validar inicio de sesión 
    public async login (req:Request,res:Response){ 
        await Db.query('SELECT * FROM docente', function(err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
    //Listar docentes 
    public async listarDocentes (req:Request,res:Response){ 
        await Db.query('SELECT * FROM docente WHERE estado_docente = true', function(err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
}
export const loginController=new LoginController();