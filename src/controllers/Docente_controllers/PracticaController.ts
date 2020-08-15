import{Request,Response} from 'express';
import Db from '../../Database'; 
import * as firebase from 'firebase-admin';
import {Pregunta} from '../../model/Pregunta';
import storage from '../../Storage'
import util from 'util'


class PreacticaController{
public async agregarPractica(req:Request,res:Response){
    const practica=req.body.practica;
        const idLeccion = practica.idLeccion;
        const nombrePractica = practica.nombre;
        const numeroPractica = practica.numero;
        const inicioFecha=practica.fechaini;
        const inicioHora=practica.horaini;
        const finFecha = practica.fechafin;
        const finHora = practica.horafin;
        const tiempoLimite= practica.tiempoLimite+1;
    const preguntas=req.body.preguntas;
  
    const query =`INSERT INTO practica (
        tiempo_limite,
        id_leccion,
        nombre_practica,
        numero_practica,
        inicio_fecha,
        inicio_hora,
        fin_fecha,
        fin_hora,
        estado_practica,
        tx_id,tx_username,tx_host,tx_date)
    VALUES (?,?,?,?,?,?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
    Db.query(query,[tiempoLimite,idLeccion,nombrePractica,
        numeroPractica,inicioFecha,inicioHora,finFecha,finHora],async function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al crear la práctica '});
            }
            else{
                var resPract=await practicaController.agregarPreguntasPracticaSQL(result.insertId,preguntas);
                if(resPract){
                    res.status(200).json({text:'Se creo la practica correctamente'});
                }
                else{
                    res.status(500).json({text:'Error al crear la práctica '});

                }
            }
        });  
 
    }


    public async agregarPreguntasAPracticaRecienCreada(req:Request,res: Response,idPractica:Number){
        const preguntasPractica = req.body.preguntasPractica;
        console.log(preguntasPractica);
        var valores=[];
        const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica ,tx_id,tx_username,tx_host)
        VALUES ?`;
        for(let i=0;i<preguntasPractica.length;i++){
            valores.push([preguntasPractica[i].idPregunta,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);
            }
            Db.query(query,[valores],function(err,result,fields){
                if(err){
                    res.status(500).json({text:'Error al agregar preguntas a la práctica'});
                    throw err;
                }
                else{
                       //do Nothing    
                }
            });
        
       
    }
    private cargarPreguntas(req:any):Pregunta{
        let preg=new Pregunta();
        preg.pregunta=req.pregunta;
                preg.respuestas=req.respuesta;
                preg.opciones=req.opciones;
                if(req.archivo&&req.archivo!=null&&req.archivo!=='undefined'){
                    preg.archivo=req.archivo;
                    console.log(req.archivo);
                } 
                return preg;
    }
    async agregarPreguntaRepo(preguntas:any){
        try{
            const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica,tx_id,tx_username,tx_host)
            VALUES ?;`;
            const result:(arg1:string,arg2:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            var row =await result(query,[preguntas]) as any[];    
            return true;
        }   
        catch(e){
            console.log(e);
            return false;
        }    
    }
    async agregarPreguntaNueva(preguntas:any){  
       try{
            const query = `insert into pregunta (codigo_pregunta,pregunta,opciones,respuesta,recurso,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host)
            values ?;`;
            const result:(arg1:string,arg2:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            var row =await result(query,[preguntas]) as any;
            var insId=row.insertId;  
            console.log(insId);
            return insId;
       }   
       catch(e){
           console.log(e);
            return false;
       } 
    }
    async agregarNotaPractica(idPractica:number){
    
        const query =`insert into nota_practica (id_practica,id_alumno,nota_practica,estado_nota_practica,tx_id,tx_username,tx_host,tx_date)
        SELECT ?,alumno.id_alumno,0,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()
        FROM alumno INNER
        JOIN curso_alumno ON
        alumno.id_alumno=curso_alumno.id_alumno
        INNER JOIN curso ON
        curso.id_curso=curso_alumno.id_curso
        INNER JOIN tema ON
        tema.id_curso=curso.id_curso
        INNER JOIN leccion ON
        leccion.id_tema=tema.id_tema
        INNER JOIN practica ON
        practica.id_leccion=leccion.id_leccion
        where practica.id_practica=?`;
        const result:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        await result(query,[idPractica,idPractica]) as any[]; 
        
    }
    public async agregarPreguntasPracticaSQL(idPractica:number,preguntas:any[]){    
            const preguntasPractica = preguntas;
            var correcto=true;
            try{
                const preguntasRepo = [];
                const preguntasRepoNuevas = [];
                                
                for(let i=0;i<preguntasPractica.length;i++){
                    var tipo_req=preguntasPractica[i].tipo;
                if(tipo_req){    
                    preguntasRepo.push([preguntasPractica[i].id,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);    
                }  
                else{
                    const preguntasNuevas = [];
                    var data= preguntasPractica[i];
                    const idTipoPregunta = data.idTipoPregunta;
                    const idTipoRespuesta = data.idTipoRespuesta;
                    const pregunta=data.pregunta;
                    const respuesta=JSON.stringify(data.respuesta);
                    const opciones=JSON.stringify(data.opciones);
                    const recurso=data.recurso;
                    preguntasNuevas.push([1,pregunta,opciones,respuesta,recurso,idTipoPregunta,idTipoRespuesta,true,1,'root','192.168.0.10']);  
                    var resNuevo=await practicaController.agregarPreguntaNueva(preguntasNuevas);  
                    if(resNuevo){
                        preguntasRepoNuevas.push([resNuevo,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);   
                        
                    } else{
                        correcto=false;
                    }
                }
                }          
                if(correcto){                    
                    if(preguntasRepo.length!=0){                        
                    await practicaController.agregarPreguntaRepo(preguntasRepo);  
                    }                
                    if(preguntasRepoNuevas.length!=0){                      
                        await practicaController.agregarPreguntaRepo(preguntasRepoNuevas); 
                    }     
                    await practicaController.agregarNotaPractica(idPractica);  
                    return true;
                                         
                } 
                
            }
            catch(e){
               console.log(e); 
               return false;
            }  
    }
    public async agregarPreguntasPractica(req:Request,res: Response){        
        try{
            const idPractica = req.body.idPractica;
            const preguntasPractica = req.body.preguntas;
            const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            var c=0;
            for(let i=0;i<preguntasPractica.length;i++){                  
                var tipo_req=req.body.preguntas[i].tipo;
                console.log(tipo_req);
                if(tipo_req){     
                    Db.query(query,[req.body.preguntas[i].id,idPractica,preguntasPractica[i].puntuacion],function(err,result,fields){
                        if(err){                            
                            res.status(500).json({text:'Error al agregar preguntas al examen'});
                            console.log(err);
                            return false;
                        }
                        else{
                            c++;
                            if(c==preguntasPractica.length){
                                console.log("entra 2");
                                res.status(200).json({text:'Preguntas agregadas correctamente'});
                                return true;
                            }
                        
                        }
                    });
                }
                else{
                    const db=firebase.firestore()
                    let pregun=practicaController.cargarPreguntas(req.body.preguntas[i]);
                    db.collection('Preguntas').add(JSON.parse(JSON.stringify(pregun))).then((val)=>{                    
                    var data= preguntasPractica[i];
                    const codigoPregunta = val.id; 
                    const idTipoPregunta = data.idTipoPregunta;
                    const idTipoRespuesta = data.idTipoRespuesta;
                    const query2 = `insert into pregunta (codigo_pregunta,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host,tx_date)
                    values (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
                    Db.query(query2, [codigoPregunta, idTipoPregunta, idTipoRespuesta], async function (err, result, fields) {
                        if (err) {                            
                            res.status(500).json("Ocurrio un Error al Agregar la pregunta");   
                            console.log(err);
                            return false;                         
                        }
                        else {
                            Db.query(query,[result.insertId,idPractica,preguntasPractica[i].puntuacion],function(err2,result2,fields){
                                if(err2){                            
                                    res.status(500).json({text:'Error al agregar preguntas al examen'});
                                    console.log(err2);
                                    return false;
                                }
                                else{
                                    c++;
                                    if(c==preguntasPractica.length){
                                        console.log("entra 2");
                                        res.status(200).json({text:'Preguntas agregadas correctamente'});
                                        return false;
                                    }
                                
                                }
                            });
                        }
                    });                              
                }).catch((err)=>{                    
                    res.status(500).json("Ocurrio un Error al Agregar la pregunta");
                    console.log(err);
                    return false;
                });
                }                
            } 
        }
        catch(e){
            console.log(e);
            res.status(500).json("Ocurrio un Error al Agregar la pregunta");
        }    
    }
    public async modificarPractica(req:Request,res: Response){
        const idPractica = req.body.idPractica;
        const nombrePractica = req.body.nombrePractica;
        const numeroPractica = req.body.numeroPractica;
        const inicioFecha=req.body.inicioFecha;
        const finFecha=req.body.finFecha;
        const inicioHora=req.body.inicioHora;
        const finHora=req.body.finHora;
        const query = `UPDATE practica SET nombre_practica = ?,numero_practica=?,inicio_fecha =?,
        inicio_hora=?,fin_fecha =?,fin_hora=? WHERE id_practica =?`;
        Db.query(query,[nombrePractica,numeroPractica,inicioFecha,inicioHora,finFecha,finHora,idPractica],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al modificar la práctica'});
                throw err;
            }
            else{
                res.status(200).json({text:'Práctica modificada correctamente'});
            }
        });
    }
    public async eliminarPractica(req:Request,res: Response){
        const {id} = req.params;
        const query = `UPDATE practica SET estado_practica=false  WHERE id_practica =?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar la práctica'});
                throw err;
            }
            else{
                res.status(200).json({text:'Práctica eliminada correctamente'});
            }
        });
    }
    public async modificarPreguntaPractica(req:Request,res:Response){
        const idPracticaPregunta = req.body.idPracticaPregunta;
        const puntuacion=req.body.puntuacion;
        const query = `UPDATE practica_pregunta SET puntuacion_practica_pregunta = ? ,tx_date = CURRENT_TIMESTAMP()
        WHERE id_pregunta_practica   =?`;
        Db.query(query,[puntuacion,idPracticaPregunta],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo modificar la pregunta'});
                throw err;
            }
            else{
                res.status(200).json({text:'Pregunta modificada correctamente'});
            }
        });

    }
    public async listarPracticas(req:Request,res:Response){
        const {id} = req.params;
        const idDocente = req.docenteId;
        console.log(id);
        console.log(idDocente);
        const query =`SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica 
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema = leccion.id_tema
        INNER JOIN curso ON
        tema.id_curso = curso.id_curso
        INNER JOIN docente ON 
        docente.id_docente = curso.id_docente
        WHERE leccion.id_leccion=?
        AND docente.id_docente = ?
        AND practica.estado_practica=true
        AND leccion.estado_leccion=true
        AND tema.estado_tema =true
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        ORDER BY practica.inicio_fecha DESC`;
        Db.query(query,[id,idDocente],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'No se pudo listar las practicas'});
                
            }
            else{
                console.log(result);
                res.status(200).json(result);
            }
        });   

    }
    public async listarNotasPractica(req:Request,res:Response){
        
        const idDocente=req.docenteId;
        const {id}=req.params;
        const query =`SELECT ntp.id_nota_practica,ntp.nota_practica,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno
        FROM nota_practica ntp
        INNER JOIN practica ON
        practica.id_practica=ntp.id_practica
        INNER JOIN leccion ON
        leccion.id_leccion=practica.id_leccion
        INNER JOIN tema ON
        leccion.id_tema=tema.id_tema
        INNER JOIN curso ON
        curso.id_curso=tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        alumno.id_alumno=curso_alumno.id_alumno
        AND alumno.id_alumno=ntp.id_alumno
        WHERE practica.estado_practica = true
        AND leccion.estado_leccion=true
        AND curso.estado_curso=true
        AND curso.id_docente=?        
        AND ntp.estado_nota_practica=true
        AND ntp.id_practica=?
        AND tema.estado_tema = true`; 
        try{
            const result:(arg1:string,arg2:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            var row =await result(query,[idDocente,id]) as any[];    
            res.status(200).json(row);        
        }
        catch(e){
            console.log(e); 
            res.status(500).json({text:'Error al listar las notas de la practica'});

        }
    }
    public async eliminarPreguntaPractica(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE practica_pregunta SET estado_pregunta_practica=false  WHERE id_pregunta_practica  =?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar la pregunta'});
                throw err;
            }
            else{
                res.status(200).json({text:'Pregunta eliminada correctamente'});
            }
        });   

    }
    public async listarPreguntasPractica(req:Request,res:Response){
        const {id} = req.params;
        const idDocente = req.docenteId;
        const query =`SELECT practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema = leccion.id_tema
        INNER JOIN curso ON
        tema.id_curso = curso.id_curso
        INNER JOIN docente ON 
        docente.id_docente = curso.id_docente
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND practica.estado_practica = true
        AND leccion.estado_leccion=true
        AND tema.estado_tema !=false
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        AND practica.id_practica=?
        AND docente.id_docente = ?;`;
        Db.query(query,[id,idDocente],async function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los exámenes'});
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
    
}

export const practicaController=new PreacticaController();