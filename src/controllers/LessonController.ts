import{Request,Response, query} from 'express';
import Db from '../Database'; 

class LessonController{
    public async agregarLeccion(req: Request, res: Response){
        
        const id = req.body.idTema;
        const numeroLeccion = req.body.numeroLeccion;
        const nombreLeccion = req.body.nombre;
        const idTipoLeccion = req.body.idTipoLeccion;
        const idImagen=req.body.idImagen;
        const query = `INSERT INTO leccion 
        (id_tema,numero_leccion,nombre_leccion,estado_leccion,id_tipo_leccion,id_imagen,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
        Db.query(query,[id,numeroLeccion,nombreLeccion,idTipoLeccion,idImagen],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al crear nueva lección'});
            }
            else{
                res.status(200).json({text:'Lección creada correctamente'});
            }
        });
    }
    public async editarLeccion(req:Request,res:Response){
        const id =req.body.id;
        const numeroLeccion = req.body.numeroLeccion;
        const nombreLeccion = req.body.nombre;
        const idTipoLeccion = req.body.idTipoLeccion;
        const idImagen=req.body.idImagen;
        const estado=req.body.estado;
        const query = `UPDATE leccion SET numero_leccion=?, nombre_leccion=?, estado_leccion = ?,id_imagen=?,id_tipo_leccion=? WHERE id_leccion= ?`;
        Db.query(query,[numeroLeccion,nombreLeccion,estado,idImagen,idTipoLeccion,id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al actualizar lección lección'});
                throw err;
            }
            else{
                res.status(200).json({text:'Lección actualizada correctamente'});
            }
        });
    }
    public async eliminarLeccion(req:Request,res:Response){
        const {id} =req.params;
        const query = `UPDATE leccion SET estado_leccion = false WHERE id_leccion= ?`;
        Db.query(query,[id], function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo eliminar la lección'});
                throw err;
            }
            else{
                res.status(200).json({text:'Lección eliminada correctamente'});
            }
        });
    }
    public async listarTipoLeccion(req:Request,res:Response){
        const query = `SELECT tipo_leccion.id_tipo_leccion,tipo_leccion.tipo_leccion
                        FROM tipo_leccion
                        WHERE tipo_leccion.estado_tipo_leccion=true`;
        Db.query(query,function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar las lecciones'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });                
        
    }
    public async listarLecciones(req:Request,res:Response){
        const {id} = req.params;
        const query = `SELECT leccion.estado_leccion,leccion.id_leccion, leccion.numero_leccion, leccion.nombre_leccion,tipo_leccion.id_tipo_leccion,leccion.id_imagen
                        FROM leccion INNER JOIN tema ON
                        leccion.id_tema=tema.id_tema
                        INNER JOIN tipo_leccion ON
                        tipo_leccion.id_tipo_leccion = leccion.id_tipo_leccion
                        WHERE tema.id_tema = ? AND
                        estado_leccion != false`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar las lecciones'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });                
        
    }
}

export const lessonController=new LessonController();