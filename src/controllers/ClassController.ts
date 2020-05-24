import{Request,Response} from 'express';
import Db from '../Database'; 

class ClassController{

    public async listaAlumnos(req:Request,res:Response){
        const {id}=req.params;
        const query = `select curso_alumno.id_curso_alumno ,alumno.id_alumno, alumno.nombre_alumno, alumno.ap_paterno_alumno,alumno.ap_materno_alumno, sum(nota_modulo.nota_modulo*modulo.rubrica/100) as 'nota'
        from curso_alumno inner join alumno on 
        curso_alumno.id_alumno = alumno.id_alumno
        inner join nota_modulo on
        alumno.id_alumno=nota_modulo.id_alumno
        inner join modulo on 
        nota_modulo.id_modulo=modulo.id_modulo
        inner join curso on
        curso.id_curso=modulo.id_curso
        where curso_alumno.id_curso=?
        and curso.estado_curso = true 
        and alumno.estado_alumno=true
        and modulo.estado_modulo=true
        and curso_alumno.estado_curso_alumno=true
        group by curso_alumno.id_alumno , curso_alumno.id_curso_alumno
        order by alumno.ap_paterno_alumno;`;
        await Db.query(query,[id], function(err, result, fields) {
            if (err) throw err;
            res.json(result);   
        });
    }
    public async bajaAlumnoCurso(req:Request,res:Response){
        const {id}=req.params;
        const query =`UPDATE curso_alumno SET estado_curso_alumno = false WHERE id_curso_alumno= ?`
        Db.query(query, [id], function (err, result, fields) {
            if (err) {
                res.status(403);
                res.json({ text: 'Error en la eliminación' });
                throw err;
            }
            else {
                res.json({ text: 'El alumno ha sido eliminado con éxito' });
                res.status(200);
            }
        });
    }
    
    public async obtenerAlumnoAltaCurso(req:Request,res:Response){
        const correoAlumno = req.body.correoAlumno;
        const query =`SELECT id_alumno FROM alumno WHERE correo_alumno = ? AND estado_alumno = true`;
        Db.query(query, [correoAlumno], function (err, result, fields) {
            if (err) {
                res.status(403);
                res.json({ text: 'Error' });
                throw err;
            }
            else {
                if (result.length>0){
                    res.json(result);
                }
                else{
                    res.json({ text:'Alumno no encontrado'})
                }
                     
            }
        });
    }

    public async altaAlumnoCurso(req: Request,res:Response){
        const idAlunmo = req.body.idAlunmo;
        const idCurso = req.body.idCurso;
        const query =`INSERT INTO curso_alumno (id_alumno,id_curso,estado_curso_alumno,tx_id,tx_username,tx_host,tx_date)
                      VALUES (?,?,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP())`;
        Db.query(query,[idAlunmo,idCurso],function(err,result,fields){
            if(err){
                throw err;
            }
            else{
                
            }
        });
    }


}


export const classController=new ClassController();