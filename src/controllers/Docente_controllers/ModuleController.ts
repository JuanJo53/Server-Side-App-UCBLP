import{Request,Response, query} from 'express';
import Db from '../../Database'; 
import util from 'util'

class ModuleController{
    public async listarColores(req:Request,res:Response){
        const query = `SELECT color.id_color,color.valor
                        FROM color
                        WHERE color.estado_color=true`;
        Db.query(query,function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los colores'});
            }
            else{
                res.status(200).json(result);
            }
        });                
        
    }
    async agregarNotasAlumno(idModulo:number,idCurso:number){
        const query =`insert into nota_modulo (id_alumno,id_modulo,nota_modulo,estado_nota_modulo,tx_id,tx_username,tx_host,tx_date)
        SELECT alumno.id_alumno,?,0,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()
        FROM alumno INNER
        JOIN curso_alumno ON
        alumno.id_alumno=curso_alumno.id_alumno
        where curso_alumno.id_curso=?`;
        const result:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        await result(query,[idModulo,idCurso]) as any[]; 
        
    }
    public async agregarModuloPersonalizado(req:Request,res:Response){
        const nombreModulo=req.body.nombreModulo;
        const rubrica = req.body.rubrica;
        const idCurso = req.body.idCurso;
        const idColor = req.body.idColor;
        const idImagen = req.body.idImagen;
        console.log(req.body);
        const query =`insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        (?,?,?,?,true,2,?,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()) `;
        Db.query(query,[nombreModulo,rubrica,idCurso,idColor,idImagen],async function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al crear el módulo'});
            }
            else{
                await moduleController.agregarNotasAlumno(result.insertId,idCurso);
                res.status(200).json({text:'Módulo creado correctamente'});
            }
        });
    }

    public async listarModulos(req: Request,res:Response){
        const {id} = req.params;
        const idDocente =req.docenteId;
        const query =`SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.id_imagen,color.id_color ,modulo.id_tipo_modulo, modulo.estado_modulo FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        INNER JOIN docente ON
        docente.id_docente = curso.id_docente
        WHERE curso.id_curso = ?
        AND docente.id_docente =? 
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        AND modulo.estado_modulo !=0`;
        Db.query(query,[id,idDocente],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los módulos personalizados'});
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async listarModulosPredeterminados(req: Request, res:Response){
        const {id} = req.params;
        const idDocente = req.docenteId;
        const query =`SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.imagen,color.valor FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        INNER JOIN docente on
        docente.id_docente = curso.id_docente
        WHERE curso.id_curso = ?
        AND docente.id_docente = ?
        AND modulo.estado_modulo !=0
        AND modulo.id_tipo_modulo = 1
        AND color.estado_color=true
        AND imagen.estado_imagen=true
        AND curso.estado_curso=true
        AND docente.estado_docente = true`;
        Db.query(query,[id,idDocente],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los módulos predeterminados'});
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async listarModulosPersonalizados(req: Request, res:Response){
        const {id} = req.params;
        const idDocente = req.docenteId;
        const query =`SELECT modu.id_modulo,modu.nombre_modulo, modu.rubrica 
        FROM modulo modu 
        JOIN curso cur 
        ON cur.id_curso =modu.id_curso
        JOIN tipo_modulo tm ON
        modu.id_tipo_modulo = tm.id_tipo_modulo
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        WHERE tm.id_tipo_modulo = 2
        AND cur.id_curso = ?
        AND dc.id_docente = ?
        AND modu.estado_modulo !=0
        AND cur.estado_curso=true
        AND tm.estado_tipo_modulo = true
        AND dc.estado_docente = true;
      `;
        Db.query(query,[id,idDocente],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los módulos personalizados'});
                throw err;
            }
            else{
                res.status(200).json(result);
            }
        });
    }
    public async actualizarRubricas(req:Request,res:Response){
        console.log(req.body);
        const rubricas = req.body.rubricas;

        const query = `UPDATE modulo SET rubrica = ? WHERE id_modulo = ?`;
        var tam=rubricas.length;
        if(tam>0){
            for(let rubrica of rubricas){
                Db.query(query,[rubrica.rubrica,rubrica.id_modulo],function(err,result,fields){
                    if(err){
                        console.log(err);
                        res.status(500).json({text:'Error al actualizar el módulo'});
                    }
                    else{
                        tam--;
                        if(tam==0){
                            res.status(200).json({text:'Módulo actualizado'});
                        }
                    }
                });
            }
        }
        else{
            res.status(200).json({text:'Módulo actualizado'});
        }
    }
    public async editarModuloPersonalizado(req:Request,res:Response){
        console.log(req.body);
        const id = req.body.id;
        const nombreModulo=req.body.nombreModulo;
        const rubrica = req.body.rubrica;
        const idColor = req.body.idColor;
        const idImagen = req.body.idImagen;
        const estado=req.body.estado;
        const query = `UPDATE modulo SET estado_modulo=?,nombre_modulo = ?, rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
        Db.query(query,[estado,nombreModulo,rubrica,idColor,idImagen,id],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al actualizar el módulo'});
            }
            else{
                res.status(200).json({text:'Módulo actualizado'});
            }
        });
    }
    public async editarModuloPredeterminado(req:Request,res:Response){
        const id = req.body.id;
        const rubrica = req.body.rubrica;
        const idColor = req.body.idColor;
        const idImagen = req.body.idImagen;
        const estado=req.body.estado;
        const query = `UPDATE modulo SET  estado_modulo = ?, rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
        Db.query(query,[estado,rubrica,idColor,idImagen,id],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al actualizar el módulo'});
            }
            else{
                res.status(200).json({text:'Módulo actualizado'});
            }
        });
    }
    public async desactivarModulo(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE modulo SET  estado_modulo = 2  WHERE id_modulo = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al desactivar el módulo'});
            }
            else{
                res.status(200).json({text:'Módulo desactivado'});
            }
        });
    }
    public async activarModulo(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE modulo SET  estado_modulo = 1  WHERE id_modulo = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al activar el módulo'});
            }
            else{
                res.status(200).json({text:'Módulo activado'});
            }
        });
    }
    public async eliminarModulo(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE modulo SET   estado_modulo=0  WHERE id_modulo = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al actualizar el módulo'});
            }
            else{
                res.status(200).json({text:'Módulo actualizado'});
            }
        });
    }
    public async listarModulosSimple(req: Request, res:Response){
        const {id} = req.params;
        const query =`SELECT modulo.id_modulo,modulo.nombre_modulo 
        FROM modulo WHERE modulo.id_curso = ?
        AND modulo.estado_modulo = 1
        AND modulo.id_tipo_modulo = 2`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los módulos personalizados'});
            }
            else{
                res.status(200).json(result);
            }
        });
    }


}

 export const moduleController=new ModuleController();
