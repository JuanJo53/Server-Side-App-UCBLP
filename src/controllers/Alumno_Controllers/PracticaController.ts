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