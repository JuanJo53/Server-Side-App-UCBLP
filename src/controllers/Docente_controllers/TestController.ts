import{Request,Response} from 'express';
import Db from '../../Database'; 
import {ConFirebase} from '../../FIrebase';
import * as firebase from 'firebase-admin';
import {Pregunta} from '../../model/Pregunta';
import storage from '../../Storage'

class TestController{

public async agregarExamen(req:Request,res:Response){
    const idTema = req.body.idTema;
    const numeroExamen = req.body.numeroExamen;
    const inicioExamen=req.body.inicioExamen;
    const finExamen = req.body.finExamen;
    const preguntasExamen = req.body.preguntasExamen;
    const query =`INSERT INTO examen_tema (id_tema,numero_examen,estado_examen,inicio_examen,fin_examen,tx_id,tx_username,tx_host,tx_date)
    VALUES (?,?,true,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
    Db.query(query,[idTema,numeroExamen,inicioExamen,finExamen],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al crear el examen '});
                throw err;
            }
            else{
                if(preguntasExamen!=null && preguntasExamen.length>0){ 
                    console.log("Last ID " + result.insertId);
                    testController.agregarPreguntasAExamenRecienCreado(req,res,result.insertId);
                
            }
                res.status(200).json({text:'Examen creado correctamente'});
            }
        });  
 
    }
    private async agregarPreguntasAExamenRecienCreado(req:Request,res:Response,idExamen:Number){
        const preguntasExamen = req.body.preguntasExamen;
        const valores=[];
        const query=`INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host)
                VALUES ? `;  
                for(let i=0;i<preguntasExamen.length;i++){
                    valores.push([preguntasExamen[i].idPregunta,idExamen,preguntasExamen[i].puntuacion,true,1,'root','192.168.0.10']);
                }
                    Db.query(query,[valores],function(err,result,fields){
                        if(err){
                            res.status(500).json({text:'Error al registrar las preguntas'});
                            throw err;
                        }
                        else{
                            //Do nothing
                        }
                    });
                
    }
    public async modificarExamen(req:Request,res: Response){
        const idExamen = req.body.idExamen;
        const numeroExamen = req.body.numeroExamen;
        const inicioExamen=req.body.inicioExamen;
        const finExamen = req.body.finExamen;
        const query = `UPDATE examen_tema SET numero_examen=? ,inicio_examen = ?,fin_examen =? , tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen =?`;
        Db.query(query,[numeroExamen,inicioExamen,finExamen,idExamen],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al modificar el examen'});
                throw err;
            }
            else{
                res.status(200).json({text:'Examen modificado correctamente'});
            }
        });
    }
    public async eliminarExamen(req:Request,res: Response){
        const {id} = req.params;
        const query = `UPDATE examen_tema SET estado_examen=false  WHERE id_examen =?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar el examen'});
                throw err;
            }
            else{
                res.status(200).json({text:'Examen eliminado correctamente'});
            }
        });
    }
    private cargarPreguntas(req:any):Pregunta{
        let preg=new Pregunta();
        preg.pregunta=req.pregunta;
                preg.respuestas=req.respuestas;
                preg.opciones=req.opciones;
                if(req.archivo&&req.archivo!=null&&req.archivo!='undefined'){
                    preg.archivo=req.archivo;
                    console.log(req.archivo);
                } 
                return preg;
    }
    public async agregarPregunta(cod:any,idTipo:any,idTipoRes:any):Promise<any> {
        const codigoPregunta = cod;
        const idTipoPregunta = idTipo;
        const idTipoRespuesta = idTipoRes;
        const query = `insert into pregunta (codigo_pregunta,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host,tx_date)
        values (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
        Db.query(query, [codigoPregunta, idTipoPregunta, idTipoRespuesta], async function (err, result, fields) {
            if (err) {
                return false;
            }
            else {
                return result.insertId;
            }
        });

    }
    public async agregarPreguntasExamen(req:Request,res: Response){        
        try{
            const idExamen = req.body.idExamen;
            const preguntasExamen = req.body.preguntasExamen;
            const query = `INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            var c=0;
            for(let i=0;i<preguntasExamen.length;i++){                  
                var tipo_req=req.body.preguntasExamen[i].tipo;
                if(tipo_req==true){     
                    Db.query(query,[req.body.preguntasExamen[i].id,idExamen,preguntasExamen[i].puntuacion],function(err,result,fields){
                        if(err){                            
                            res.status(500).json({text:'Error al agregar preguntas al examen'});
                            console.log(err);
                            return false;
                        }
                        else{
                            c++;
                            if(c==preguntasExamen.length){
                                console.log("entra 2");
                                res.status(200).json({text:'Preguntas agregadas correctamente'});
                                return true;
                            }
                        
                        }
                    });
                }
                else{
                    const db=firebase.firestore()
                    let pregun=testController.cargarPreguntas(req.body.preguntasExamen[i].body);
                    db.collection('Preguntas').add(JSON.parse(JSON.stringify(pregun))).then((val)=>{                    
                    var data= preguntasExamen[i];
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
                            Db.query(query,[result.insertId,idExamen,preguntasExamen[i].puntuacion],function(err2,result2,fields){
                                if(err2){                            
                                    res.status(500).json({text:'Error al agregar preguntas al examen'});
                                    console.log(err2);
                                    return false;
                                }
                                else{
                                    c++;
                                    if(c==preguntasExamen.length){
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
    public async modificarPreguntaExamen(req:Request,res:Response){
        const idExamenPregunta = req.body.idExamenPregunta;
        const puntuacion=req.body.puntuacion;
        const query = `UPDATE examen_pregunta SET puntuacion_examen_pregunta = ? ,tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen_pregunta  =?`;
        Db.query(query,[puntuacion,idExamenPregunta],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo modificar la pregunta'});
                throw err;
            }
            else{
                res.status(200).json({text:'Pregunta modificada correctamente'});
            }
        });

    }
    public async listarExamenes(req:Request,res:Response){
        const {id} = req.params;
        const idDocente = req.docenteId;
        const query =`SELECT examen_tema.id_examen,examen_tema.inicio_examen,examen_tema.fin_examen
        FROM examen_tema INNER JOIN tema ON
        examen_tema.id_tema = tema.id_tema
        INNER JOIN curso ON 
        curso.id_curso = tema.id_curso
        INNER JOIN docente ON
        docente.id_docente = curso.id_docente
        WHERE tema.id_tema = ?
        AND docente.id_docente = ?
        AND examen_tema.estado_examen=true
        AND tema.estado_tema !=false
        AND curso.estado_curso=true
        AND docente.estado_docente = true;`;
        Db.query(query,[id,idDocente],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los exámenes'});
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
    public async eliminarPreguntaExamen(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE examen_pregunta SET estado_examen_pregunta=false  WHERE id_examen_pregunta =?`;
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
    public async listarPreguntasExamen(req:Request,res:Response){
        const {id} = req.params;
        const idDocente = req.docenteId;
        const query =`SELECT examen_pregunta.id_examen_pregunta,examen_pregunta.id_pregunta,pregunta.codigo_pregunta,
        examen_pregunta.puntuacion_examen_pregunta
        FROM examen_tema INNER JOIN examen_pregunta ON
        examen_tema.id_examen = examen_pregunta.id_examen
        INNER JOIN pregunta ON
        pregunta.id_pregunta = examen_pregunta.id_pregunta
        INNER JOIN tema ON
        examen_tema.id_tema = tema.id_tema
        INNER JOIN curso ON
        curso.id_curso =tema.id_curso
        INNER JOIN docente ON
        docente.id_docente = curso.id_docente
        WHERE examen_pregunta.estado_examen_pregunta  = true
        AND examen_tema.estado_examen = true
        AND tema.estado_tema !=false
        AND curso.estado_curso = true
        AND docente.estado_docente=true
        AND examen_tema.id_examen= ?
        AND docente.id_docente=?;`;
        Db.query(query,[id,idDocente],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los exámenes'});
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
}

export const testController=new TestController();