import{Request,Response} from 'express';
//Importamos la libreía para crear tokens
//Para instalarlo utiliza el comando: npm i @types/jsonwebtoken -D
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Db from '../Database'; 

class CursoController{
    public async obtenerCursosDocente(req:Request,res:Response){ 
        const id = req.docenteId;
        console.log("ID: "+id);
        //Regresa la informacion basica de un curso
        const  query = `select curso.id_curso  ,curso.nombre_curso, semestre.semestre, count(curso_alumno.id_alumno) as estudiantes  
        from curso inner join semestre on 
        curso.id_semestre = semestre.id_semestre 
        inner join curso_alumno on 
        curso.id_curso=curso_alumno.id_curso 
        inner join alumno 
        on curso_alumno.id_alumno = alumno.id_alumno 
        inner join docente 
        on curso.id_docente=docente.id_docente 
        where curso.estado_curso=true and docente.id_docente= ?
        group by curso.id_curso`;
        //Regresa la informacion de los dias y horarios del curso
        const  query3 = `select dia_semana.dia_semana as 'diaSemana', curso_dia.hora_inicio as 'horaInicio', curso_dia.hora_conclusion as 'horaConclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        inner join docente on
        docente.id_docente = curso.id_docente
        where curso.id_curso=?`;
        //Arreglo que almacena los resultados de las consultas
         let resultData: any=[];
        await Db.query(query,[id], function(err, result, fields) {
            if (err) throw err;
            //retorna la informacion basica del curso agregando los dias y horarios de cada uno
            var c=1;
            for(let i in result ){
                Db.query(query3,[result[i].id_curso],function(err2,result3,fields2){
                    if (err2) throw err2;
                    result[i].dias=result3;
                    if(c==result.length){
                        res.json(result);
                    }
                    c++;
                    
                });
            }
        });
    
        
    }

    public async obtenerCursosDocentePrueba(req:Request,res:Response){ 
        const id = req.docenteId;
        console.log("ID: "+id);
        const  query = `select curso.id_curso as 'idCurso',dia_semana.dia_semana as 'diaSemana', curso_dia.hora_inicio as 'horaInicio', curso_dia.hora_conclusion as 'horaConclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        inner join docente on
        docente.id_docente = curso.id_docente
        where docente.id_docente= 19 and curso.estado_curso=true
        group by curso.id_curso, dia_semana.id_dia_semana, curso_dia.id_curso_dia`;
        await Db.query(query,[id], function(err, result, fields) {
            if (err) throw err;
            res.json(result);   
            console.log(result.length);
        });
    
        
    }
}

export const cursoController=new CursoController();