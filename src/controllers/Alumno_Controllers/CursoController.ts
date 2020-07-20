import{Request,Response} from 'express';
import Db from '../../Database'; 

class CursoAlumnoController{
public async listarCursos(req:Request,res:Response){
        const idAlumno = req.estudianteId;
        const query =`SELECT curso.nombre_curso,curso.id_curso
        FROM curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso = curso.id_curso
        INNER JOIN alumno ON
        alumno.id_alumno = curso_alumno.id_alumno
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.estado_alumno = true
        AND alumno.id_alumno = ?`;
        Db.query(query,[idAlumno],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al cargar las lecciones'});
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
}

export const cursoAlumnoController=new  CursoAlumnoController();