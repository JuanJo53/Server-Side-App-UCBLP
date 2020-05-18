import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../Database'; 

class CursoController{
    public async obtenerCursosDocente(req:Request,res:Response){ 
        const id = req.docenteId;
        const iddoc= req.params;
        //console.log("ID: "+id);
        const  query = `SELECT id_curso from curso where id_docente = ?`;
        await Db.query(query,[iddoc], function(err, result, fields) {
            if (err) throw err;
            res.json(result);
            //console.log()
        });
    }

}

export const cursoController=new CursoController();