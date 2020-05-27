import{Request,Response} from 'express';
import Db from '../Database'; 

class ThemeController{
    public async agregarTema(req:Request,res:Response){
        const numeroTema = req.body.numeroTema;
        const nombreTema = req.body.nombreTema;
        const idImagen = req.body.idImagen;
        const idCurso = req.body.idCurso;
        const query =`INSERT INTO tema (numero_tema,nombre_tema,id_curso,estado_tema,id_imagen,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP()) `;
        Db.query(query,[numeroTema,nombreTema,idCurso,idImagen],function(err, result, fields){
            if(err){
                res.status(501).json({text:'No se pudo crear el tema'});
                    throw err;
            }
            else{
                res.status(200).json({text:'Tema creado exitosamente'});
            }
        });
    }    
    public async listarTemas(req:Request,res:Response){
        const {id} =req.params;
        const query = `SELECT id_tema,numero_tema,nombre_tema,id_imagen,tema_habilitado FROM tema INNER JOIN curso ON
        curso.id_curso=tema.id_curso WHERE curso.id_curso = ? AND tema.estado_tema=true`;
        Db.query(query,[id], function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo cargar la lista de temas'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async actualizarTema(req:Request,res:Response){
        const id =req.body.idTema;
        const numeroTema = req.body.numeroTema;
        const nombreTema = req.body.nombreTema;
        const estadoTema = req.body.estado;
        const idImagen = req.body.idImagen;
        const query = `UPDATE tema SET numero_tema=?, nombre_tema=?, id_imagen=?,tema_habilitado=? WHERE id_tema= ?`;
        Db.query(query,[numeroTema,nombreTema,idImagen,id,estadoTema], function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo actualizar tema'});
                throw err;
            }
            else{
                res.status(200).json({text:'Tema actualizado correctamente'});
            }
        });
    }
    public async eliminarTema(req:Request,res:Response){
        const {id} =req.params;
        const query = `UPDATE tema SET estado_tema = false WHERE id_tema= ?`;
        Db.query(query,[id], function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo eliminar tema'});
                throw err;
            }
            else{
                res.status(200).json({text:'Tema eliminado correctamente'});
            }
        });
    }


}

export const themeController=new ThemeController();