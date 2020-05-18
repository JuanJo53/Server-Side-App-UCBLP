import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../Database'; 

class CursoController{
    public async obtenerCursosDocente(req:Request,res:Response){ 
        const id = req.docenteId;
        console.log("ID: "+id);
        const  query = `select curso.id_curso,curso.nombre_curso, semestre.semestre, count(curso_alumno.id_alumno) as estudiantes  
        from curso inner join semestre on 
        curso.id_semestre = semestre.id_semestre 
        inner join curso_alumno on 
        curso.id_curso=curso_alumno.id_curso 
        inner join alumno 
        on curso_alumno.id_alumno = alumno.id_alumno 
        inner join docente 
        on curso.id_docente=docente.id_docente 
        where curso.estado_curso=true and docente.id_docente= ?
        group by curso.id_curso`;
        await Db.query(query,[id], function(err, result, fields) {
            if (err) throw err;
            res.json(result);   
        });
    
        
    }

}

export const cursoController=new CursoController();