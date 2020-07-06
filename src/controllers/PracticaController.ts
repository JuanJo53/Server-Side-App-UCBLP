import{Request,Response} from 'express';
import Db from '../Database'; 
import * as firebase from 'firebase-admin';
import {Pregunta} from '../model/Pregunta';
import storage from '../Storage'


class PreacticaController{
public async agregarPractica(req:Request,res:Response){
    const idLeccion = req.body.idLeccion;
    const nombrePractica = req.body.nombre;
    const numeroPractica = req.body.numero;
    const inicioFecha=req.body.fechaini;
    const inicioHora=req.body.horaini;
    const finFecha = req.body.fechafin;
    const finHora = req.body.horafin;
  
    const query =`INSERT INTO practica (
        id_leccion,
        nombre_practica,
        numero_practica,
        inicio_fecha,
        inicio_hora,
        fin_fecha,
        fin_hora,
        estado_practica,
        tx_id,tx_username,tx_host,tx_date)
    VALUES (?,?,?,?,?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
    Db.query(query,[idLeccion,nombrePractica,
        numeroPractica,inicioFecha,inicioHora,finFecha,finHora],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'Error al crear la práctica '});
            }
            else{
                res.status(200).json({idPractica:result.insertId});
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
    public async agregarPreguntasPractica(req:Request,res: Response){        
        try{
            const idPractica = req.body.idPractica;
            const preguntasPractica = req.body.preguntas;
            const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            var c=0;
            for(let i=0;i<preguntasPractica.length;i++){                  
                var tipo_req=req.body.preguntas[i].tipo;
                if(tipo_req==true){     
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
        const inicioPractica=req.body.inicioPractica;
        const finPractica = req.body.finPractica;
        const query = `UPDATE practica SET nombre_practica = ?,numero_practica=?,inicio_practica=?,fin_practica =? , tx_date = CURRENT_TIMESTAMP()
        WHERE id_practica =?`;
        Db.query(query,[nombrePractica,numeroPractica,inicioPractica,finPractica,idPractica],function(err,result,fields){
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
        console.log(id);
        const query =`SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        WHERE leccion.id_leccion=?
        AND practica.estado_practica=true`;
        Db.query(query,[id],function(err,result,fields){
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
        const query =`SELECT practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND practica.id_practica=?`;
        Db.query(query,[id],function(err,result,fields){
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