import{Request,Response} from 'express';
import Db from '../../Database'; 

class LeccionAlumnoController{
public async listarLecciones(req:Request,res:Response){
        const {id} = req.params;
        const idAlumno = 1;
        const query =`SELECT leccion.estado_leccion,leccion.id_leccion, leccion.numero_leccion, leccion.nombre_leccion,tipo_leccion.id_tipo_leccion,leccion.id_imagen
        FROM leccion INNER JOIN tema ON
        leccion.id_tema=tema.id_tema
        INNER JOIN tipo_leccion ON
        tipo_leccion.id_tipo_leccion = leccion.id_tipo_leccion
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso = curso.id_curso
        INNER JOIN alumno ON
        alumno.id_alumno = curso_alumno.id_alumno
        WHERE tema.id_tema = ? 
        AND leccion.estado_leccion != false
        AND tipo_leccion.estado_tipo_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.estado_alumno = true
        AND alumno.id_alumno = ?`;
        Db.query(query,[id,idAlumno],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar las lecciones'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
}

export const leccionAlumnoController=new  LeccionAlumnoController();