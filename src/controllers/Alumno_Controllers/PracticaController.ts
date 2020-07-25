import{Request,Response} from 'express';
import Db from '../../Database'; 
import * as firebase from 'firebase-admin';
import {Pregunta} from '../../model/Pregunta';
import storage from '../../Storage'
import util from 'util'


class PracticaController{
    
    public async infoPractica(req:Request,res:Response){
        const {id} = req.params;
        const idEstudiante=req.estudianteId;
        const query =`SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.id_practica=?
        AND practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?`;
        Db.query(query,[id,idEstudiante],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'No se pudo listar las practicas'});
                
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
    public async listarPracticas(req:Request,res:Response){
        const {id} = req.params;
        const idEstudiante=req.estudianteId;
        console.log(idEstudiante);
        console.log(id);
        const query =`SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE leccion.id_leccion=?
        AND practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?`;
        Db.query(query,[id,idEstudiante],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).json({text:'No se pudo listar las practicas'});
                
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
    public async obtenerPractica(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
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
                var docs=datos.docs;
                for(let doc of docs){ 
                    if(doc.id===row[preg].codigo_pregunta){   
                                             
                        var preguntaaux=doc.data();
                        preguntaaux.respuestas=[];
                        row[preg].pregunta=preguntaaux;
                        break;
                    }
                }
            }
            res.status(200).json(row);
        }
       }
       catch(e){
        console.log(e);
        res.status(500).json({text:'No se pudo listar la practica'})
       }

    } 
    compararRespuestas(re1:number[],re2:number[]){
        var ver=true;
        if(re1.length!=re2.length){
           ver=false;
        }
        else{
            for(let i in re1){
                if(re1[i]!=re2[i]){
                    ver=false;
                    break;
                }
            }
        }
        return ver;
    }
    public async revisarPractica(req:Request,res:Response){
        const id = req.body.id;
        const idEstudiante=req.estudianteId;
        const preguntasR=req.body.preguntas as any[];
        const query =`SELECT pregunta.id_pregunta,curso.id_curso,practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND practica_pregunta.estado_pregunta_practica   = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND practica.id_practica=?`;
        const agregarNota =`
            INSERT INTO nota_practica(id_practica,id_alumno,nota_practica,estado_nota_practica,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`
        const obtenerNotasPractica=`
        SELECT AVG(nota_practica.nota_practica) as promedio
        FROM nota_practica INNER JOIN practica ON
        practica.id_practica = nota_practica.id_practica
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?` 
        const moduloPractica=`
        SELECT modulo.id_modulo 
        FROM modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        WHERE curso.id_curso = ?
        AND curso.estado_curso = true
        AND modulo.nombre_modulo = 'Theme Practices'
        AND modulo.estado_modulo =true `
        const agregarNotaModulo =`
            UPDATE nota_modulo set nota_modulo=?,estado_nota_modulo=true,tx_id=1,tx_username='root',tx_host='192.168.0.10',tx_date=CURRENT_TIMESTAMP()
            WHERE id_alumno=? AND id_modulo=?`
    try{ 
        const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        var row =await result2(query,[id]) as any[];
        if(row.length==0){            
            res.status(500).json({text:'No esta habilitado para ver esta practica'})
        }   
        else{            
            console.log(row);
            if(row.length!=preguntasR.length){
                res.status(500).json({text:'Error en los datos Enviados'})
                
            }
            else{
                var listaPreg=[] as string[];
                for(let preg of row){
                    listaPreg.push(preg.codigo_pregunta)
                }
                const db=firebase.firestore()
                var datos=await db.collection('Preguntas').where(firebase.firestore.FieldPath.documentId(),"in",listaPreg).get();
                var puntuacion=0;
                for(let preg in preguntasR){
                    var docs=datos.docs;
                        for(let doc of docs){ 
                            if(doc.id===preguntasR[preg].codigoPregunta){   
                                                    
                                var preguntaaux=doc.data();
                                if(practicaController.compararRespuestas(preguntaaux.respuestas,preguntasR[preg].respuesta)){
                                    puntuacion+=row[preg].puntuacion_practica_pregunta;
                                }
                                break;
                            }
                        }
                    var preguntaaux=datos.docs[preg].data();
                    
                }
                await result2(agregarNota,[id,idEstudiante,puntuacion,id,idEstudiante,]) as any[];
                var promedioPracticas=await result2(obtenerNotasPractica,[idEstudiante]) as any[];
                var idModulo=await result2(moduloPractica,[row[0].id_curso]) as any[];
                await result2(agregarNotaModulo,[promedioPracticas[0].promedio,idEstudiante,idModulo[0].id_modulo]) as any[];
                console.log(idModulo);
                res.status(200).json("Se califico el examen correctamente");
                
            }
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({text:'No se pudo listar la practica'})
    }

    }

    }

export const practicaController=new PracticaController();