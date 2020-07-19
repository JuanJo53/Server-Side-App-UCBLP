import{Request,Response} from 'express';
import Db from '../../Database'; 

class TemaAlumnoController{
public async listarTemas(req:Request,res:Response){
        const {id} = req.params;
        const idAlumno = req.estaudianteId;
        const query =`SELECT tm.id_tema,tm.numero_tema,tm.nombre_tema,tm.id_imagen,tm.estado_tema 
        FROM tema tm 
        INNER JOIN curso cur ON
        cur.id_curso=cur.id_curso
        INNER JOIN curso_alumno ca ON
        ca.id_curso = cur.id_curso
        INNER JOIN alumno alu ON
        ca.id_alumno = alu.id_alumno  
        WHERE cur.id_curso = ?
        AND (tm.estado_tema=true OR tm.estado_tema=2)
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND alu.estado_alumno = true
        AND alu.id_alumno = ?`;
        Db.query(query,[id,idAlumno],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar los temas'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
}

export const temaAlumnoController=new TemaAlumnoController();