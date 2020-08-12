import{Request,Response} from 'express';
import Db from '../../Database'; 

class RecursoAlumnoController{
    
    public async obtenerRecursosAlumno(req:Request,res:Response){
      const {id}=req.params;  
      const query=`SELECT seccion.id_seccion,seccion.nombre_seccion
      FROM seccion 
      JOIN curso ON  
      curso.id_curso = seccion.id_curso 
      WHERE curso.id_curso = ?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true`      
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
      Db.query(query,[id],async function (err,result,fields){
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
}

export const recursoAlumnoController=new RecursoAlumnoController();