import{Request,Response} from 'express';
import Db from '../../Database'; 
import * as firebase from 'firebase-admin';
import {Pregunta} from '../../model/Pregunta';
import storage from '../../Storage'
import util from 'util'
import { recursoController } from './RecursoController';


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
        var tiempoLimite=null;
        if(practica.tiempoLimite!=null){
            tiempoLimite=practica.tiempoLimite+1;
        }
        
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
                if(resPract!=null){
                    res.status(200).json({recursos:resPract});
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
            const query = `insert into pregunta (codigo_pregunta,pregunta,opciones,respuesta,recurso,id_tipo_pregunta,id_tipo_respuesta,id_habilidad,estado_pregunta,tx_id,tx_username,tx_host)
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
        WHERE practica.id_practica=?
        AND alumno.estado_alumno=true
        AND curso_alumno.estado_curso_alumno=true
        AND curso.estado_curso=true
        AND tema.estado_tema=true
        AND leccion.estado_leccion=true
        AND practica.estado_practica=true`;
        const result:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        await result(query,[idPractica,idPractica]) as any[]; 
        
    }
    async sacarPractica(idPractica:number,idDocente:number){
        try{
            const query =`SELECT practica.id_practica,practica.nombre_practica,practica.inicio_fecha,practica.fin_fecha,practica.inicio_hora,practica.fin_hora,practica.tiempo_limite
            FROM practica INNER JOIN leccion ON
            leccion.id_leccion = practica.id_leccion
            INNER JOIN tema ON
            tema.id_tema = leccion.id_tema
            INNER JOIN curso ON
            tema.id_curso = curso.id_curso
            INNER JOIN docente ON 
            docente.id_docente = curso.id_docente
            WHERE docente.id_docente = ?
            AND leccion.estado_leccion=true
            AND tema.estado_tema =true
            AND curso.estado_curso = true
            AND docente.estado_docente = true
            AND practica.id_practica=?`;        
            const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            var row =await result2(query,[idDocente,idPractica]) as any[];
            console.log(row);
            return row[0];
        }
        catch(e){
            console.log(e);
            return false;
        }
    }

    public async obtenerPractica(req:Request,res:Response){
        const {id}=req.params;
        const idDocente=req.docenteId;
        const practica=await practicaController.sacarPractica(Number(id),Number(idDocente));
        if(practica){
            const query =`SELECT practica_pregunta.id_pregunta_practica,practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta
            ,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
            practica_pregunta.puntuacion_practica_pregunta,pregunta.pregunta,pregunta.respuesta,pregunta.opciones,pregunta.recurso ,pregunta.id_habilidad
            FROM practica INNER JOIN practica_pregunta ON
            practica.id_practica = practica_pregunta.id_practica
            INNER JOIN pregunta ON
            pregunta.id_pregunta = practica_pregunta.id_pregunta
            WHERE practica_pregunta.estado_pregunta_practica   = true
            AND practica.id_practica=?`;
           try{ 
                const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
                var row =await result2(query,[id]) as any[];
                if(row.length==0){            
                    res.status(200).json({practica,preguntas:row});
                }   
                else{   
                    for(let preg of row){
                    preg.opciones=JSON.parse(preg.opciones);
                    preg.respuesta=JSON.parse(preg.respuesta);
                    
                    if(preg.id_habilidad==1){
                        var url=await recursoController.getUrlViewResourcePractice(preg.recurso,120);
                        preg.recurso=url;
                    }
                    else if(preg.id_habilidad==2){
                        var url=await recursoController.getUrlViewResourcePractice(preg.recurso,120);
                        preg.recurso=url;
                    }
                    else {
                        preg.recurso=null;
                    }
                    }
                    res.status(200).json({practica,preguntas:row});
                }
           }
           catch(e){
                console.log(e);
                res.status(500).json({text:'No se pudo listar la practica'})
           }
        }
        else{
            res.status(500).json({text:'No se pudo listar la practica'})
        }
        
   
    }
    public async agregarPreguntasPracticaSQL(idPractica:number,preguntas:any[]){    
            const preguntasPractica = preguntas;
            var correcto=true;
            try{
                var resourcesList=[];
                const preguntasRepo = [];
                const preguntasRepoNuevas = [];
                                
            
                for(let i=0;i<preguntasPractica.length;i++){
                    var tipo_req=preguntasPractica[i].tipo;
                if(tipo_req==1){    
                    preguntasRepo.push([preguntasPractica[i].id,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);    
                }  
                else{

                    const preguntasNuevas = [];
                    var data= preguntasPractica[i];
                    const idTipoPregunta = data.idTipoPregunta;
                    const idTipoRespuesta = data.idTipoRespuesta;
                    const idHabilidad = data.idHabilidad;
                    const pregunta=data.pregunta;
                    const respuesta=JSON.stringify(data.respuesta);
                    const opciones=JSON.stringify(data.opciones);
                    var recurso=data.recurso;
                    if(idHabilidad==1){
                        recurso=await recursoController.getUrlResourcePractice(1);
                        resourcesList.push(recurso["url"]);
                        recurso=recurso["route"];
                    }
                    else if(idHabilidad==2){
                        recurso=await recursoController.getUrlResourcePractice(2);
                        resourcesList.push(recurso["url"]);
                        recurso=recurso["route"];
                    }
                    else {
                        recurso=null;
                    }
                    preguntasNuevas.push([1,pregunta,opciones,respuesta,recurso,idTipoPregunta,idTipoRespuesta,idHabilidad,true,1,'root','192.168.0.10']);  
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
                    return resourcesList;
                                         
                } 
                
            }
            catch(e){
               console.log(e); 
               return null;
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
    async eliminarPreguntas(preguntasEli:any[]){
        try{
            if(preguntasEli.length>0){
                const queryEl="UPDATE practica_pregunta SET estado_pregunta_practica = 0 WHERE id_pregunta_practica IN (?)"
                const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
                await result2(queryEl,[preguntasEli]) as any[];
            }
            return true;
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
    async actualizarPregunta(pregunta:any){
        try{
            const queryEl="UPDATE practica_pregunta SET puntuacion_practica_pregunta = ? WHERE id_pregunta_practica=?"
            const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            await result2(queryEl,[pregunta.puntuacion,pregunta.id]) as any[];
            return true;
        }
        catch(e){
            console.log(e);
            return false;
        }

    }
    async modificarPreguntas(preguntas:any,idPractica:number){
        const preguntasPractica = preguntas;
        var correcto=true;
        try{
            const preguntasRepo = [];
            const preguntasRepoNuevas = [];
            const promises = [];
            var resourcesList=[];                
            for(let i=0;i<preguntasPractica.length;i++){
                var tipo_req=preguntasPractica[i].tipo;
            if(tipo_req==1){    
                preguntasRepo.push([preguntasPractica[i].id,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);    
            }  
            else{
                if(tipo_req==0){
                    const preguntasNuevas = [];
                    var data= preguntasPractica[i];
                    const idTipoPregunta = data.idTipoPregunta;
                    const idTipoRespuesta = data.idTipoRespuesta;
                    const idHabilidad=data.idHabilidad;
                    const pregunta=data.pregunta;
                    const respuesta=JSON.stringify(data.respuesta);
                    const opciones=JSON.stringify(data.opciones);
                    var recurso=data.recurso;
                    var recPar=String(recurso).split("/");
                    var codigo=recPar[recPar.length-1].split("?");
                    if(String(recurso).substring(0,30)==="https://storage.googleapis.com"){
                        recurso=recPar[recPar.length-2]+"/"+codigo[0];
                    }
                    else{
                        if(idHabilidad==1){
                            recurso=await recursoController.getUrlResourcePractice(1);
                            resourcesList.push(recurso["url"]);
                            recurso=recurso["route"];
                        }
                        else if(idHabilidad==2){
                            recurso=await recursoController.getUrlResourcePractice(2);
                            resourcesList.push(recurso["url"]);
                            recurso=recurso["route"];
                        }
                        else {
                            recurso=null;
                        }
                    }
                    preguntasNuevas.push([1,pregunta,opciones,respuesta,recurso,idTipoPregunta,idTipoRespuesta,idHabilidad,true,1,'root','192.168.0.10']);  
                    var resNuevo=await practicaController.agregarPreguntaNueva(preguntasNuevas);  
                    if(resNuevo){
                        preguntasRepoNuevas.push([resNuevo,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);   
                        
                    } else{
                        correcto=false;
                    }
                }
                else{
                    if(tipo_req==2){              
                        promises.push(practicaController.actualizarPregunta(preguntasPractica[i]))
                    }
                }
            }
            }
            
            const responses = await Promise.all(promises);
            if(responses.includes(false)){
                correcto=false;
            }          
            if(correcto){                    
                if(preguntasRepo.length!=0){                        
                await practicaController.agregarPreguntaRepo(preguntasRepo);  
                }                
                if(preguntasRepoNuevas.length!=0){                      
                    await practicaController.agregarPreguntaRepo(preguntasRepoNuevas); 
                }     
                console.log(resourcesList);
                return resourcesList;
                                        
            } 
            else{
                return false;
            }
            
        }
        catch(e){
            console.log(e); 
            return false;
        }  
    }
    public async modificarPractica(req:Request,res: Response){
        console.log(req.body);
        const practica=req.body.practica;
        const idPractica = practica.id;
        const nombrePractica = practica.nombre;
        const inicioFecha=practica.fechaini;
        const inicioHora=practica.horaini;
        const finFecha = practica.fechafin;
        const finHora = practica.horafin;
        var tiempoLimite=null;
        if(practica.tiempoLimite!=null){
            tiempoLimite=practica.tiempoLimite+1;
        }
        const preguntas=req.body.preguntas;
  
        const query =`UPDATE practica 
        set tiempo_limite=?,
        nombre_practica=?,
        inicio_fecha=?,
        inicio_hora=?,
        fin_fecha=?,
        fin_hora=?
        WHERE id_practica=?
        `;

        
        try{
            const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            await result2(query,[tiempoLimite,nombrePractica,inicioFecha,inicioHora,finFecha,finHora,idPractica]) as any[];
            var pregEli=await practicaController.eliminarPreguntas(req.body.preguntasEli);
            var pregRes=await practicaController.modificarPreguntas(preguntas,idPractica);
            if(pregEli&&pregRes){
                res.status(200).json({recursos:pregRes});
            }
            else{
                res.status(500).json("No se pudo modificar la practica");
            }
        }
        catch(e){
            console.log(e);
            res.status(500).json("No se pudo modificar la practica");
        }   

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
        const query =`SELECT ntp.id_nota_practica,ntp.nota_practica,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno,ntp.practica_dada
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
        practica_pregunta.puntuacion_practica_pregunta, pregunta.pregunta,pregunta.opciones
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
    async respuestasEstudiante(req:Request,res:Response){
        const {id} = req.params;
        const idDocente=req.docenteId;
        console.log(id);
        var query=`SELECT pregunta.pregunta,practica_pregunta.puntuacion_practica_pregunta, pregunta.id_tipo_respuesta,pregunta.id_tipo_pregunta,
        pregunta_respuesta.respuesta as alumno_respuesta,pregunta_respuesta.puntaje,pregunta.opciones,pregunta.respuesta
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
        INNER JOIN nota_practica ON
        nota_practica.id_practica=practica.id_practica
        INNER JOIN pregunta_respuesta ON
        pregunta_respuesta.id_pregunta_practica=practica_pregunta.id_pregunta_practica
        and pregunta_respuesta.id_alumno=nota_practica.id_alumno
        WHERE practica_pregunta.estado_pregunta_practica= true
        AND practica.estado_practica = true
        AND leccion.estado_leccion=true
        AND tema.estado_tema !=false
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        AND nota_practica.estado_nota_practica=true
        AND pregunta_respuesta.estado_pregunta_respuesta=true
        AND nota_practica.id_nota_practica=?
        AND docente.id_docente = ?;`
        const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        try{
            var row=await result2(query,[id,idDocente]) as any[];
            for(let preg of row){
                preg.respuesta=JSON.parse(preg.respuesta);
                preg.opciones=JSON.parse(preg.opciones);
                preg.alumno_respuesta=JSON.parse(preg.alumno_respuesta);
            }
            res.status(200).json(row);
        }
        catch(e){
            res.status(500).json({text:'No se pudo listar las respuestas'});

        }


    }
    public async dataSetPractica(req: Request,res:Response){
        const idDocente = req.docenteId;
        const query =`SELECT alu.genero_alumno,alu.edad_alumno,car.carrera,COUNT(IF(hab.id_habilidad=1,1,null)) as "L",
        COUNT(IF(hab.id_habilidad=2,1,null)) as "R",COUNT(IF(hab.id_habilidad=3,1,null)) as "G",COUNT(IF(hab.id_habilidad=4,1,null)) as "V",
        iF(AVG(npr.nota_practica)>51,"Si","No") approved
                FROM alumno alu
                JOIN carrera car ON
                alu.id_carrera = car.id_carrera
                JOIN curso_alumno ca ON
                ca.id_alumno = alu.id_alumno
                JOIN curso cur ON
                ca.id_curso = cur.id_curso
                JOIN tema tm ON
                tm.id_curso = cur.id_curso
                JOIN leccion lc ON
                lc.id_tema = tm.id_tema
                JOIN practica pr ON
                pr.id_leccion = lc.id_leccion
                JOIN nota_practica npr ON
                npr.id_practica = pr.id_practica
                JOIN practica_pregunta prpr ON
                prpr.id_practica=pr.id_practica 
                JOIN pregunta preg on
                preg.id_pregunta=prpr.id_pregunta
                JOIN habilidad hab on
                hab.id_habilidad=preg.id_habilidad
                JOIN pregunta_respuesta pregres on
                (pregres.id_pregunta_practica=prpr.id_pregunta_practica
                and pregres.id_alumno=alu.id_alumno)    
                JOIN docente dc ON
                cur.id_docente = dc.id_docente
                WHERE alu.id_alumno = npr.id_alumno
                AND alu.estado_alumno = true
                AND car.estado_carrera=true
                AND ca.estado_curso_alumno=true
                AND cur.estado_curso = true
                AND tm.estado_tema =true
                AND lc.estado_leccion = true
                AND pr.estado_practica = true
                AND npr.estado_nota_practica = true
                AND preg.estado_pregunta = true
                AND hab.estado = true
                AND pregres.estado_pregunta_respuesta=true
                AND npr.practica_dada = 1
                AND dc.id_docente = ?
                AND pregres.puntaje=0
                GROUP BY alu.id_alumno;`;
        Db.query(query,[idDocente],async function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los exámenes'});
            }
            else{ 
                var menor="";
                for(let fila of result){
                    if(fila["L"]<fila["R"]&&fila["L"]<fila["V"]&&fila["L"]<fila["G"]){
                        menor="Listening";   
                    }
                    else{
                        if(fila["R"]<fila["L"]&&fila["R"]<fila["V"]&&fila["R"]<fila["G"]){
                            menor="Reading";   
                        }
                        else{
                            if(fila["V"]<fila["L"]&&fila["V"]<fila["R"]&&fila["V"]<fila["G"]){
                                menor="Vocabulary";   
                            }
                            else{
                                menor="Grammar";
                            }
                        }
                    }
                    delete fila["L"];
                    delete fila["V"];
                    delete fila["G"];
                    delete fila["R"];
                    fila["weak_skill"]=menor;
                }
                
                res.status(200).json(result);
            }
        });   
    }
    
}

export const practicaController=new PreacticaController();