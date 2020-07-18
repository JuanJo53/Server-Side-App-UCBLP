import{Request,Response, query, text} from 'express';
import Db from '../../Database'; 

class ForoController{
    public async crearForo(req:Request,res:Response){
        const idCurso=req.body.idCurso;
        const nombreForo=req.body.nombreForo;
        const descripcionForo = req.body.descripcionForo;
        const fechaInicio= req.body.fechaInicio;
        const fechaFin = req.body.fechaFin;
        const query= `INSERT INTO foro (id_curso,nombre_foro,descripcion_foro,fecha_creacion,fecha_fin,estado_foro,tx_id,tx_username,tx_host,tx_date) 
        VALUES (?,?,?,?,?,TRUE,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
        Db.query(query,[idCurso,nombreForo,descripcionForo,fechaInicio,fechaFin],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo crear el foro'});
                throw err;
            }
            else{
                res.status(200).json({text:'Foro creado con éxito'});
            }
        });
    }
    public async listarForos(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT foro.id_foro, foro.nombre_foro, foro.descripcion_foro, foro.fecha_creacion,foro.fecha_fin
                      FROM foro INNER JOIN curso ON
                      foro.id_curso=curso.id_curso
                      WHERE curso.id_curso = ?
                      AND foro.estado_foro=true`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al listar los foros'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async modificarForos(req:Request,res:Response){
        const id=req.body.id;
        const nombreForo=req.body.nombreForo;
        const descripcionForo = req.body.descripcionForo;
        const fechaFin = req.body.fechaFin;
        const query = `UPDATE foro SET nombre_foro = ?, descripcion_foro= ?,fecha_creacion=CURRENT_DATE(),fecha_fin=? WHERE id_foro = ?`;
        Db.query(query,[nombreForo,descripcionForo,fechaFin],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al modificar el foro'});
                throw err;
            }
            else{
                res.status(200).json({text:'Foro modificado'});
            }
        });
    }
    public async eliminarForo(req:Request,res:Response){
        const {id}=req.params;
        const query = `UPDATE foro SET estado_foro=false WHERE id_foro=?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar el foro'});
                throw err;
            }
            else{
                res.status(200).json({text:'Foro eliminado con éxito'});
            }
        });
    }
    public async agregarMensaje(req:Request,res:Response){
        const idForo = req.body.idForo;
        const codigoUsuario = req.body.codigoUsuario;
        const mensaje = req.body.mensaje;
        const query =`INSERT INTO mensaje (id_foro,codigo_usuario,mensaje,estado_mensaje,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
        Db.query(query,[idForo,codigoUsuario,mensaje],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al enviar el mensaje'});
                throw err;
            }
            else{
                res.status(200).json({text:'Mensaje enviado con éxito'});
            }
        });
    }
}
export const foroController=new ForoController();