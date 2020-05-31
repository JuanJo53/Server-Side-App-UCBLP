import{Request,Response, query} from 'express';
import Db from '../Database'; 

class ModuleController{

    public async agregarModuloPersonalizado(req:Request,res:Response){
        const nombreModulo=req.body.nombreModulo;
        const rubrica = req.body.rubrica;
        const idCurso = req.body.idCurso;
        const idColor = req.body.idColor;
        const idImagen = req.body.idImagen;
        const query =`insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,modulo_habilitado,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        (?,?,?,?,true,true,2,?,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()) `;
        Db.query(query,[nombreModulo,rubrica,idCurso,idColor,idImagen],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al crear el módulo'});
                throw err;
            }
            else{
                res.status(200).json({text:'Módulo creado correctamente'});
            }
        });
    }

    public async listarModulos(req: Request,res:Response){
        const {id} = req.params;
        const query =`SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.imagen,color.valor ,modulo.id_tipo_modulo FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        WHERE curso.id_curso = ?
        AND modulo.estado_modulo = true`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los módulos personalizados'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async listarModulosPredeterminados(req: Request, res:Response){
        const {id} = req.params;
        const query =`SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.imagen,color.valor FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        WHERE curso.id_curso = ?
        AND modulo.estado_modulo = true
        AND modulo.id_tipo_modulo = 1`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los módulos personalizados'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async editarModuloPersonalizado(req:Request,res:Response){
        const {id} = req.params;
        const nombreModulo=req.body.nombreModulo;
        const rubrica = req.body.rubrica;
        const idColor = req.body.idColor;
        const idImagen = req.body.idColor;
        const query = `UPDATE modulo SET nombre_modulo = ?, rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
        Db.query(query,[nombreModulo,rubrica,idColor,idImagen,id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al actualizar el módulo'});
                throw err;
            }
            else{
                res.status(500).json({text:'Módulo actualizado'});
            }
        });
    }
    public async editarModuloPredeterminado(req:Request,res:Response){
        const {id} = req.params;
        const rubrica = req.body.rubrica;
        const idColor = req.body.idColor;
        const idImagen = req.body.idColor;
        const query = `UPDATE modulo SET  rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
        Db.query(query,[rubrica,idColor,idImagen,id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al actualizar el módulo'});
                throw err;
            }
            else{
                res.status(500).json({text:'Módulo actualizado'});
            }
        });
    }
    public async desactivarModulo(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE modulo SET  modulo_habilitado = false  WHERE id_modulo = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al desactivar el módulo'});
                throw err;
            }
            else{
                res.status(500).json({text:'Módulo desactivado'});
            }
        });
    }
    public async activarModulo(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE modulo SET  modulo_habilitado = true  WHERE id_modulo = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al activar el módulo'});
                throw err;
            }
            else{
                res.status(500).json({text:'Módulo activado'});
            }
        });
    }
    public async eliminarModulo(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE modulo SET  modulo_habilitado = false, estado_modulo=false  WHERE id_modulo = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al actualizar el módulo'});
                throw err;
            }
            else{
                res.status(500).json({text:'Módulo actualizado'});
            }
        });
    }


}

 export const moduleController=new ModuleController();
