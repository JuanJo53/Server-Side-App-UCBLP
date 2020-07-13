import { Request, Response } from 'express';
import Db from '../Database';

class CursoController {
    public async obtenerCursosDocente(req: Request, res: Response) {
        const id = req.docenteId;
        console.log("ID: " + id);
        //Regresa la informacion basica de un curso
        const query = `select curso.id_curso  ,curso.nombre_curso, semestre.semestre, count(curso_alumno.id_alumno) as estudiantes  
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
        const query3 = `select dia_semana.dia_semana as 'diaSemana', curso_dia.hora_inicio as 'horaInicio', curso_dia.hora_conclusion as 'horaConclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        inner join docente on
        docente.id_docente = curso.id_docente
        where curso.id_curso=?`;
        //Arreglo que almacena los resultados de las consultas
        let resultData: any = [];
        await Db.query(query, [id], function (err, result, fields) {
            if (err) throw err;
            //retorna la informacion basica del curso agregando los dias y horarios de cada uno
            var c = 1;
            for (let i in result) {
                Db.query(query3, [result[i].id_curso], function (err2, result3, fields2) {
                    if (err2) throw err2;
                    result[i].dias = result3;
                    if (c == result.length) {
                        res.json(result);
                    }
                    c++;

                });
            }
        });


    }

    public async obtenerCursosDocentePestania(req: Request, res: Response) {
        const {id} = req.params;
        const query = `SELECT cu.id_curso, cu.nombre_curso
        FROM curso cu
        JOIN docente do ON
        cu.id_docente = do.id_docente
        AND do.estado_docente =true
        AND cu.estado_curso = true
        AND do.id_docente = ?;`;
        Db.query(query, [id], function (err, result, fields) {
            if (err) {
                res.json({text: 'Error al obtener los cursos'}).status(500);
                throw err;
            }
            else{
                res.json(result).status(200);
            }
            
        });


    }
    public async agregarCurso(req: Request, res: Response) {
        const id = req.body.idDocente;
        const nombreCurso = req.body.nombreCurso;
        const idSemestre = req.body.idSemestre;
        const idNivel = req.body.idNivel;
        const query = `insert into curso (nombre_curso,estado_curso,id_docente,id_semestre,id_nivel,tx_id,tx_username,tx_host,tx_date) 
        values(?,true,?,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
        Db.query(query, [nombreCurso, id, idSemestre, idNivel], function (err, result, fields) {
            if (err){
                res.status(500).json({ text: 'Error al crear el curso '});
                throw err;
            }
            else {
                console.log("Last ID " + result.insertId);
                cursoController.agregarModulosPredeterminados(req, res, result.insertId);
            }
        });
    }

    private async agregarModulosPredeterminados(req: Request, res: Response, idCurso: Number) {
        const query3 = `insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        ('Assistance',5.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Lessons',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Practices',10.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Test',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Assesments',45.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP());`;
        Db.query(query3, [idCurso, idCurso, idCurso, idCurso, idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al crear módulos' });
                throw err;
            }
            else {
                res.status(200).json({ text: 'Curso creado con éxito' })
            }
        });
    }

}

export const cursoController = new CursoController();