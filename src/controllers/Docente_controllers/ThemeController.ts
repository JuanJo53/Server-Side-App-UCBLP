import{Request,Response} from 'express';
import Db from '../../Database'; 

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
        const idDocente = req.docenteId;
        const query = `SELECT tema.id_tema,tema.numero_tema,tema.nombre_tema,tema.id_imagen,tema.estado_tema 
        FROM tema 
        INNER JOIN curso ON
        curso.id_curso=tema.id_curso 
        INNER JOIN docente ON
        curso.id_docente = docente.id_docente
        WHERE curso.id_curso = ? 
        AND docente.id_docente = ?
        AND (tema.estado_tema=true OR tema.estado_tema=2)
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        ORDER BY tema.numero_tema ASC`;
        Db.query(query,[id,idDocente], function(err,result,fields){
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
        console.log(req.body);
        const id =req.body.idTema;
        const numeroTema = req.body.numeroTema;
        const nombreTema = req.body.nombreTema;
        const estadoTema = req.body.estado;
        const idImagen = req.body.idImagen;
        const query = `UPDATE tema SET numero_tema=?, nombre_tema=?, id_imagen=?,estado_tema=? WHERE id_tema= ?`;
        Db.query(query,[numeroTema,nombreTema,idImagen,estadoTema,id], function(err,result,fields){
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