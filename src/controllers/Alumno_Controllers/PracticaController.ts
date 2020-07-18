import{Request,Response} from 'express';
import Db from '../../Database'; 
import * as firebase from 'firebase-admin';
import {Pregunta} from '../../model/Pregunta';
import storage from '../../Storage'
import util from 'util'


class PracticaController{

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
                    let pregun;
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
    public async listarPracticas(req:Request,res:Response){
        const {id} = req.params;
        const idEstudiante=req.estaudianteId;
        const query =`SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN curso ON
        leccion.id_curso=curso.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        WHERE leccion.id_leccion=?
        AND practica.estado_practica=true
        AND curso_alumno.id_alumno=?`;
        Db.query(query,[id,idEstudiante],function(err,result,fields){
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
    public async obtenerPractica(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND practica.id_practica=?`;
       try{ 
        const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        var row =await result2(query,[id]) as any[];
        if(row.length==0){            
            res.status(500).json({text:'No esta habilitado para ver esta practica'})
        }   
        else{            
            var listaPreg=[] as string[];
            for(let preg of row){
                listaPreg.push(preg.codigo_pregunta)
            }
            const db=firebase.firestore()
            var datos=await db.collection('Preguntas').where(firebase.firestore.FieldPath.documentId(),"in",listaPreg).get();
            
            for(let preg in row){
                row[preg].pregunta=datos.docs[preg].data();
            }
            res.status(200).json(row);
        }
       }
       catch(e){
        console.log(e);
        res.status(500).json({text:'No se pudo listar la practica'})
       }

    }
    
}

export const practicaController=new PracticaController();