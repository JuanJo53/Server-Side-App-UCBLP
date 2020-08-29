import{Request,Response} from 'express';
import Db from '../../Database'; 
import storage from '../../Storage'

class RecursoAlumnoController{
    
    public async obtenerRecursosAlumno(req:Request,res:Response){
      const {id}=req.params;  
      const query=`SELECT seccion.id_seccion,seccion.nombre_seccion
      FROM seccion 
      INNER JOIN curso ON  
      curso.id_curso = seccion.id_curso 
      INNER JOIN curso_alumno ON
      curso_alumno.id_curso=curso.id_curso
      INNER JOIN alumno ON
      alumno.id_alumno=curso_alumno.id_alumno
      WHERE curso.id_curso = ?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND curso_alumno.estado_curso_alumno=true
      AND alumno.estado_alumno=true
      AND alumno.id_alumno=?`      
      const query2=`SELECT recurso.nombre_recurso,recurso.ruta_recurso,tipo_recurso.id_tipo_recurso,recurso.id_recurso
      FROM recurso 
      INNER JOIN tipo_recurso ON
      recurso.id_tipo_recurso=tipo_recurso.id_tipo_recurso
      INNER JOIN seccion ON
      recurso.id_seccion = seccion.id_seccion
      INNER JOIN curso ON
      curso.id_curso = seccion.id_curso
      WHERE seccion.id_seccion = ? 
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND recurso.estado_recurso !=false 
      AND tipo_recurso.estado_tipo_recurso !=false
      ORDER BY recurso.fecha_subida_recurso ASC`  
      Db.query(query,[id,req.estudianteId],async function (err,result,fields){
        if(err){
            console.log(err);
            res.status(500).json({text:'No se pudo listar los recursos'});
            
        }
        else{
            var c=result.length;
            if(c==0){
                res.status(200).json(result);
            }
            for(let sec of result){
                Db.query(query2,[sec.id_seccion],async function (err2,result2,fields){
                    if(err2){
                        console.log(err2);
                        res.status(500).json({text:'No se pudo listar los recursos'});                        
                    }
                    else{
                        sec.recursos=result2;
                        c--;
                        if(c==0){                   
                            res.status(200).json(result);
                        }
                        
                    }
                });
            }
            
        }
    });
    }
    
    public async urlFile(req:Request,res:Response){
        const ubicacion=req.body.file;
        const a=await storage.bucket("archivos-idiomas");
        const url=await a.file(ubicacion).getSignedUrl({

            action:"read",
            version:"v4",
            expires:Date.now()+100*60*60,  
            });
            res.json({url:url});
        
    }
}

export const recursoAlumnoController=new RecursoAlumnoController();