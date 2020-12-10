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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../../Database"));
const util_1 = __importDefault(require("util"));
class CursoController {
    sacarCantidadAlumnos(id_curso) {
        return __awaiter(this, void 0, void 0, function* () {
            const alumnosq = `select count(curso_alumno.id_alumno) as est
        FROM curso
        inner join curso_alumno on 
        curso.id_curso=curso_alumno.id_curso 
        inner join alumno 
        on curso_alumno.id_alumno = alumno.id_alumno
        WHERE
        curso.id_curso=?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(alumnosq, [id_curso]);
                return row;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    obtenerCursosDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.docenteId;
            console.log("ID: " + id);
            //Regresa la informacion basica de un curso
            const query = `select curso.id_curso  ,curso.nombre_curso, semestre.id_semestre  
        from curso inner join semestre on 
        curso.id_semestre = semestre.id_semestre 
        inner join docente 
        on curso.id_docente=docente.id_docente 
        where curso.estado_curso=true 
        and semestre.estado_semestre=true
        and docente.estado_docente = true
        and docente.id_docente= ?
        group by curso.id_curso`;
            //Regresa la informacion de los dias y horarios del curso
            const query3 = `select dia_semana.dia_semana as 'diaSemana', curso_dia.hora_inicio as 'horaInicio', curso_dia.hora_conclusion as 'horaConclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        inner join docente on
        docente.id_docente = curso.id_docente
        where curso.id_curso=?
        AND curso.estado_curso = true
        AND curso_dia.estado_curso_dia = true
        AND dia_semana.estado_dia_semana=true`;
            //Arreglo que almacena los resultados de las consultas
            let resultData = [];
            yield Database_1.default.query(query, [id], function (err, result, fields) {
                var result_1, result_1_1;
                var e_1, _a;
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        res.json({ text: 'Error al obtener los semestres' }).status(500);
                    }
                    //retorna la informacion basica del curso agregando los dias y horarios de cada uno
                    else {
                        var c = 1;
                        console.log(result);
                        try {
                            for (result_1 = __asyncValues(result); result_1_1 = yield result_1.next(), !result_1_1.done;) {
                                let i = result_1_1.value;
                                var cant_est = yield exports.cursoController.sacarCantidadAlumnos(i.id_curso);
                                if (!cant_est) {
                                    res.json({ text: 'Error al obtener los semestres' }).status(500);
                                }
                                else {
                                    i.estudiantes = cant_est[0].est || 0;
                                    Database_1.default.query(query3, [i.id_curso], function (err2, result3, fields2) {
                                        if (err2)
                                            throw err2;
                                        i.dias = result3;
                                        if (c == result.length) {
                                            res.json(result);
                                        }
                                        c++;
                                    });
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (result_1_1 && !result_1_1.done && (_a = result_1.return)) yield _a.call(result_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                });
            });
        });
    }
    obtenerSemestres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT sem.id_semestre, sem.semestre
        FROM semestre sem
        WHERE sem.estado_semestre =true;`;
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.json({ text: 'Error al obtener los semestres' }).status(500);
                    console.log(err);
                }
                else {
                    res.json(result).status(200);
                }
            });
        });
    }
    obtenerNiveles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT niv.id_nivel, niv.nivel
        FROM nivel niv
        WHERE niv.estado_nivel =true;`;
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.json({ text: 'Error al obtener los niveles' }).status(500);
                    console.log(err);
                }
                else {
                    res.json(result).status(200);
                }
            });
        });
    }
    obtenerCursosDocentePestania(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT cu.id_curso, cu.nombre_curso
        FROM curso cu
        JOIN docente do ON
        cu.id_docente = do.id_docente
        AND do.estado_docente =true
        AND cu.estado_curso = true
        AND do.id_docente = ?;`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.json({ text: 'Error al obtener los cursos' }).status(500);
                    throw err;
                }
                else {
                    res.json(result).status(200);
                }
            });
        });
    }
    agregarHorarioCurso(dias, idCurso) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(dias);
            var valores = [];
            var query = `INSERT INTO curso_dia (id_dia_semana,id_curso,hora_inicio,hora_conclusion,estado_curso_dia,tx_id,tx_username,tx_host)
        VALUES (?,?,?,?,?,?,?,?)`;
            var prim = false;
            for (let dia of dias) {
                if (!prim) {
                    prim = true;
                }
                else if (prim) {
                    query += ",\n(?,?,?,?,?,?,?,?)";
                }
                valores.push(dia.dia);
                valores.push(idCurso);
                valores.push(dia.horaInicio);
                valores.push(dia.horaFin);
                valores.push(true);
                valores.push(1);
                valores.push('root');
                valores.push('192.168.0.10');
            }
            try {
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                yield result(query, valores);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    agregarCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.docenteId;
            const nombreCurso = req.body.curso;
            const idSemestre = req.body.idSemestre;
            const idNivel = req.body.idNivel;
            const dias = req.body.dias;
            const query = `insert into curso (nombre_curso,estado_curso,id_docente,id_semestre,id_nivel,tx_id,tx_username,tx_host,tx_date) 
        values(?,true,?,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
            Database_1.default.query(query, [nombreCurso, id, idSemestre, idNivel], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(500).json({ text: 'Error al crear el curso ' });
                        console.log(err);
                    }
                    else {
                        console.log("Last ID " + result.insertId);
                        var crear = yield exports.cursoController.agregarHorarioCurso(dias, result.insertId);
                        if (crear) {
                            exports.cursoController.agregarModulosPredeterminados(req, res, result.insertId);
                        }
                        else {
                            res.status(500).json({ text: 'Error al crear el curso ' });
                        }
                    }
                });
            });
        });
    }
    agregarModulosPredeterminados(req, res, idCurso) {
        return __awaiter(this, void 0, void 0, function* () {
            const query3 = `insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        ('Attendance',5.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Lessons',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Practices',10.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Test',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Assesments',45.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP());`;
            Database_1.default.query(query3, [idCurso, idCurso, idCurso, idCurso, idCurso], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al crear módulos' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Curso creado con éxito' });
                }
            });
        });
    }
    agregarHorarioACurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const horario = req.body.horario;
            const valores = [];
            for (var i = 0; i < horario.length; i++) {
                valores.push([horario[i].idDiaSemana, idCurso, horario[i].horaInicio, horario[i].horaConclusion, true, 1, 'root', '192.168.0.10']);
            }
            const query = `INSERT INTO curso_dia(id_dia_semana,id_curso,hora_inicio,hora_conclusion,estado_curso_dia,tx_id,tx_username,tx_host)
        VALUES ?`;
            Database_1.default.query(query, [valores], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al agregar horario' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Horario agregado correctamente' });
                }
            });
        });
    }
    modificarDiaDeHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCursoDia = req.body.idCursoDia;
            const idDiaSemana = req.body.idDiaSemana;
            const horaInicio = req.body.horaInicio;
            const horaConclusion = req.body.horaConclusion;
            const query = `UPDATE curso_dia SET id_dia_semana = ?,hora_inicio=?,hora_conclusion=? WHERE id_curso_dia =?`;
            Database_1.default.query(query, [idDiaSemana, horaInicio, horaConclusion, idCursoDia], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al modificar el horario' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Horario modificado correctamente' });
                }
            });
        });
    }
    eliminarDiaDeHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE curso_dia SET estado_curso_dia = false WHERE id_curso_dia =?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar el día del horario' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Día eliminado correctamente' });
                }
            });
        });
    }
    obtenerHorariodeCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const query = `select curso_dia.id_curso_dia as 'id_curso_dia',dia_semana.dia_semana as 'dia_semana', curso_dia.hora_inicio as 'hora_inicio', curso_dia.hora_conclusion as 'hora_conclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        WHERE curso.id_curso=?
        AND curso.estado_curso = true
        AND curso_dia.estado_curso_dia = true
        AND dia_semana.estado_dia_semana=true`;
            Database_1.default.query(query, [idCurso], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al listar los días del curso' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.cursoController = new CursoController();
//# sourceMappingURL=CursoController.js.map