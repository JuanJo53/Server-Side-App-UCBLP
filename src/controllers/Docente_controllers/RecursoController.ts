import{Request,Response, query} from 'express';
import Db from '../../Database'; 
import * as firebase from 'firebase-admin';
import {Pregunta} from '../../model/Pregunta';
import storage from '../../Storage'

class RecursoController{
    private generateId():string{
        // Alphanumeric characters
        const chars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i = 0; i < 20; i++) {
          autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      
        return autoId;
      }    
public async crearImaasdf(req:Request,res:Response){
    var filename = './src/archivos/asdf.jpg';
    const bucketName = 'bucket-name';
    const a=await storage.bucket("archivos-idiomas");
    const nombre=recursoController.generateId()
    var date=String(Date.now());
    a.upload(filename,{destination:"audio/"+nombre+date}).then((val)=>{
        console.log(val);
    }).catch((err)=>{
        console.log(err);
    })
}
public async urlFile(req:Request,res:Response){
    const ubicacion=req.body.file;
    const a=await storage.bucket("archivos-idiomas");
    const nombre=recursoController.generateId()
    var date=String(Date.now());
        const url=await a.file(ubicacion).getSignedUrl({

            action:"read",
            version:"v4",
            expires:Date.now()+100*60*60,  


            });
        res.json({url:url});
    
}
public async subirDoc(req:Request,res:Response){
    const a=await storage.bucket("archivos-idiomas");
    const nombre=recursoController.generateId()
    var date=String(Date.now());
        const url=await a.file("doc/"+nombre+date).getSignedUrl({

            action:"write",
            version:"v4",
            expires:Date.now()+100*60*60,  


            });
            console.log(url);
        res.json({url:url,ruta:"doc/"+nombre+date});
    
}
public async subirAudio(req:Request,res:Response){
    var filename = './src/archivos/asdf.jpg';
    const bucketName = 'bucket-name';
    const a=await storage.bucket("archivos-idiomas");
    const nombre=recursoController.generateId()
    var date=String(Date.now());
        const url=await a.file("audio/"+nombre+date).getSignedUrl({

            action:"write",
            version:"v4",
            expires:Date.now()+100*60*60,  


            });
            console.log(url);
        res.json({url:url,ruta:"audio/"+nombre+date});
    
}
public async subirVideo(req:Request,res:Response){
    var filename = './src/archivos/asdf.jpg';
    const bucketName = 'bucket-name';
    const a=await storage.bucket("archivos-idiomas");
    const nombre=recursoController.generateId()
    var date=String(Date.now());
        const url=await a.file("video/"+nombre+date).getSignedUrl({

            action:"write",
            version:"v4",
            expires:Date.now()+100*60*60,  


            });
            console.log(url);
        res.json({url:url,ruta:"video/"+nombre+date});
    
}
    public async agregarSeccion(req: Request, res: Response){
        const idCurso=req.body.id;
        const nombreSeccion=req.body.nombre;
        const query = `INSERT INTO seccion (id_curso,nombre_seccion,estado_seccion,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
        Db.query(query,[idCurso,nombreSeccion],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo crear la sección'});
                throw err;
            }
            else{
                res.status(200).json({text:'Sección creada correctamente'});
            }
        });
    }
    public async agregarRecurso(req: Request, res: Response){
        const idSeccion=req.body.id;
        const nombreRecurso=req.body.resource.nombre;
        const rutaRecurso=req.body.resource.url;
        const idTipoRecurso=req.body.resource.tipo;
        const query = `INSERT INTO recurso (id_seccion,nombre_recurso,ruta_recurso,id_tipo_recurso,estado_recurso,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
        Db.query(query,[idSeccion,nombreRecurso,rutaRecurso,idTipoRecurso],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo subir el recurso'});
                throw err;
            }
            else{
                res.status(200).json({text:'Recurso agregado correctamente'});
            }
        });
    }
    public async listarSecciones(req:Request,res:Response){    
      const {id}=req.params;
      const idDocente = req.docenteId;
      const query=`SELECT seccion.id_seccion,seccion.nombre_seccion
      FROM seccion 
      JOIN curso ON  
      curso.id_curso = seccion.id_curso 
      JOIN docente ON
      docente.id_docente = curso.id_docente;
      WHERE curso.id_curso = ?
      AND docente.id_docente = ?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND docente.estado_docente = true`      
      const query2=`SELECT recurso.nombre_recurso,recurso.ruta_recurso,tipo_recurso.id_tipo_recurso,recurso.id_recurso
      FROM recurso 
      INNER JOIN tipo_recurso ON
      recurso.id_tipo_recurso=tipo_recurso.id_tipo_recurso
      INNER JOIN seccion ON
      recurso.id_seccion = seccion.id_seccion
      INNER JOIN curso ON
      curso.id_curso = seccion.id_curso
      INNER JOIN docente ON
      docente.id_docente = curso.id_docente
      WHERE seccion.id_seccion = ? 
      AND docente.id_docente =?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND docente.estado_docente = true
      AND recurso.estado_recurso !=false 
      AND tipo_recurso.estado_tipo_recurso !=false`  
      Db.query(query,[id,idDocente],async function (err,result,fields){
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
                Db.query(query2,[sec.id_seccion,idDocente],async function (err2,result2,fields){
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
    public async listarRecursos(req: Request, res: Response){
        const {id}=req.params;
        const query = `SELECT seccion.id_seccion,seccion.nombre_seccion,recurso.id_recurso,recurso.nombre_recurso,tipo_recurso.tipo_recurso
        FROM tipo_recurso INNER JOIN recurso ON
        tipo_recurso.id_tipo_recurso = recurso.id_tipo_recurso
        INNER JOIN seccion ON 
        seccion.id_seccion= recurso.id_seccion
        INNER JOIN curso ON
        curso.id_curso = seccion.id_curso
        WHERE curso.id_curso = ?
        AND seccion.estado_seccion = true
        AND recurso.estado_recurso=true
        group by recurso.id_seccion,recurso.id_recurso;`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'No se pudo listar los recursos'});
                
            }
            else{
                res.status(200).json({result});
            }
        });
    }
    public async eliminarRecurso(req:Request,res:Response){
        const {id}=req.params;
        const query = `UPDATE recurso SET estado_recurso = false WHERE id_recurso = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo eliminar el recurso'});
                throw err;
            }
            else{
                res.status(200).json({text:'Recurso eliminado'});
            }
        });
    }
    public async eliminarSeccion(req:Request,res:Response){
        const {id}=req.params;
        const query = `UPDATE seccion SET estado_seccion = false WHERE id_seccion = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo eliminar la sección'});
                throw err;
            }
            else{
                const query2 = `UPDATE recurso SET estado_recurso = false WHERE id_seccion = ?`;
                Db.query(query2,[id],function(err2,result2,fields){
                    if(err2){
                        console.log(err2);
                        res.status(500).json({text:'No se pudo eliminar la sección'});
                    }
                    else{
                        res.status(200).json({text:'Sección eliminada'});
                    }
                });
            }
        });
    }
    public async modificarSeccion(req: Request, res: Response){
        const id=req.body.id;
        const nombreSeccion=req.body.nombre;
        console.log(req.body);
        const query = `UPDATE seccion SET nombre_seccion = ? WHERE id_seccion = ?`;
        Db.query(query,[nombreSeccion,id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo actualizar la sección'});
                throw err;
            }
            else{
                res.status(200).json({text:'Sección actualizada correctamente'});
            }
        });
    }
    public async modificarRecurso(req: Request, res: Response){
        const id=req.body.resource.id;
        const nombreRecurso=req.body.resource.nombre;
        const query = `UPDATE recurso SET nombre_recurso = ? WHERE id_recurso = ?`;
        Db.query(query,[nombreRecurso,id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo actualizar el recurso'});
                throw err;
            }
            else{
                res.status(200).json({text:'Recurso actualizado correctamente'});
            }
        });
    }
}

export  const recursoController=new RecursoController();
