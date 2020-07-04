import{Request,Response} from 'express';
import Db from '../Database'; 

class AlumnoController{

    public async obtenerPerfilAlumno(req:Request,res:Response){
        const idAlumno = req.body.idAlumno;
        const idCurso = req.body.idCurso;
        const query =`SELECT alu.id_alumno,alu.nombre_alumno,alu.ap_paterno_alumno ,alu.ap_materno_alumno ,alu.correo_alumno 
        FROM alumno alu
        JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        JOIN curso cur ON
        ca.id_curso=cur.id_curso
        WHERE alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND alu.id_alumno = ?
        AND cur.id_curso = ?`;
        Db.query(query,[idAlumno,idCurso],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al obtener el perfil del alumno'});
            }
            else{
                res.status(200).json(result);
            }
        }); 
    }
    public async obtenerCalificacionesAlumnoModulo(req:Request,res:Response){
        const idAlumno = req.body.idAlumno;
        const idCurso = req.body.idCurso;
        const query =`SELECT nmod.id_nota_modulo,nmod.nota_modulo, modu.nombre_modulo 
        FROM nota_modulo nmod
        JOIN modulo modu ON
        nmod.id_modulo = modu.id_modulo
        JOIN alumno alu ON
        alu.id_alumno = nmod.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        JOIN curso cur ON
        cur.id_curso = ca.id_curso
        WHERE modu.estado_modulo = true
        AND nmod.estado_nota_modulo=true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND alu.id_alumno = ?
        AND cur.id_curso = ?;`;
        Db.query(query,[idAlumno,idCurso],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al obtener el perfil del alumno'});
            }
            else{
                res.status(200).json(result);
            }
        }); 
    }

}

export const alumnoController=new AlumnoController();