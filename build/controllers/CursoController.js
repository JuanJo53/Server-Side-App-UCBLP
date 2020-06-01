"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../Database"));
class CursoController {
    obtenerCursosDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let resultData = [];
            yield Database_1.default.query(query, [id], function (err, result, fields) {
                if (err)
                    throw err;
                //retorna la informacion basica del curso agregando los dias y horarios de cada uno
                var c = 1;
                for (let i in result) {
                    Database_1.default.query(query3, [result[i].id_curso], function (err2, result3, fields2) {
                        if (err2)
                            throw err2;
                        result[i].dias = result3;
                        if (c == result.length) {
                            res.json(result);
                        }
                        c++;
                    });
                }
            });
        });
    }
    obtenerCursosDocentePrueba(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.docenteId;
            console.log("ID: " + id);
            const query = `select curso.id_curso as 'idCurso',dia_semana.dia_semana as 'diaSemana', curso_dia.hora_inicio as 'horaInicio', curso_dia.hora_conclusion as 'horaConclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        inner join docente on
        docente.id_docente = curso.id_docente
        where docente.id_docente= 19 and curso.estado_curso=true
        group by curso.id_curso, dia_semana.id_dia_semana, curso_dia.id_curso_dia`;
            yield Database_1.default.query(query, [id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
                console.log(result.length);
            });
        });
    }
    agregarCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.idDocente;
            const nombreCurso = req.body.nombreCurso;
            const idSemestre = req.body.idSemestre;
            const idNivel = req.body.idNivel;
            console.log("ID: " + id);
            const query = `insert into curso (nombre_curso,estado_curso,id_docente,id_semestre,id_nivel,tx_id,tx_username,tx_host,tx_date) 
        values(?,true,?,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
            Database_1.default.query(query, [nombreCurso, id, idSemestre, idNivel], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al crear el curso' });
                    throw err;
                }
                else {
                    const query2 = `SELECT id_curso FROM curso WHERE id_curso = LAST_INSERT_ID()`;
                    Database_1.default.query(query2, function (err2, result2, fields2) {
                        if (err2) {
                            res.status(500).json({ text: 'Error al recuperar el id' });
                            throw err2;
                        }
                        else {
                            const idCurso = result2[0].id_curso;
                            const query3 = `insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
                       ('Assistance',5.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
                       ('Theme Lessons',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
                       ('Theme Practices',10.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
                       ('Theme Test',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
                       ('Assesments',45.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP());`;
                            Database_1.default.query(query3, [idCurso, idCurso, idCurso, idCurso, idCurso], function (err3, result3, fields3) {
                                if (err3) {
                                    res.status(500).json({ text: 'Error alcrear módulos' });
                                    throw err3;
                                }
                                else {
                                    res.status(200).json({ text: 'Curso creado con éxito' });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}
exports.cursoController = new CursoController();
//# sourceMappingURL=CursoController.js.map