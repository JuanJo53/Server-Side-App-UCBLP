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
class ClassController {
    listaAlumnos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `select curso_alumno.id_curso_alumno ,alumno.id_alumno, alumno.nombre_alumno, alumno.ap_paterno_alumno,alumno.ap_materno_alumno, sum(nota_modulo.nota_modulo*modulo.rubrica/100) as 'nota'
        from curso_alumno inner join alumno on 
        curso_alumno.id_alumno = alumno.id_alumno
        inner join nota_modulo on
        alumno.id_alumno=nota_modulo.id_alumno
        inner join modulo on 
        nota_modulo.id_modulo=modulo.id_modulo
        inner join curso on
        curso.id_curso=modulo.id_curso
        where curso_alumno.id_curso=?
        and curso.estado_curso = true 
        and alumno.estado_alumno=true
        and modulo.estado_modulo=true
        and nota_modulo.estado_nota_modulo=true
        and curso_alumno.estado_curso_alumno=true
        group by curso_alumno.id_alumno , curso_alumno.id_curso_alumno
        order by alumno.ap_paterno_alumno;`;
            yield Database_1.default.query(query, [id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    bajaAlumnoCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE curso_alumno SET estado_curso_alumno = false WHERE id_curso_alumno= ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.json({ text: 'Error en la eliminación' }).status(403);
                    throw err;
                }
                else {
                    res.json({ text: 'El alumno ha sido eliminado con éxito' }).status(200);
                }
            });
        });
    }
    obtenerAlumnoAltaCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const correoAlumno = req.body.correoAlumno;
            const query = `SELECT id_alumno,nombre_alumno,ap_paterno_alumno,ap_materno_alumno FROM alumno WHERE correo_alumno = ? AND estado_alumno = true`;
            Database_1.default.query(query, [correoAlumno], function (err, result, fields) {
                if (err) {
                    res.status(403).json({ text: 'Error' });
                    throw err;
                }
                else {
                    if (result.length > 0) {
                        res.status(200).json(result);
                    }
                    else {
                        res.statusMessage = "student not found";
                        res.status(210).json({ text: 'Alumno no encontrado' });
                    }
                }
            });
        });
    }
    altaAlumnoCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.body.idAlumno;
            const idCurso = req.body.idCurso;
            console.log(idAlumno);
            console.log(idCurso);
            const queryver = `SELECT id_curso_alumno from curso_alumno where curso_alumno.id_curso=? and curso_alumno.id_alumno=? and curso_alumno.estado_curso_alumno=true`;
            Database_1.default.query(queryver, [idCurso, idAlumno], function (err, result0, fields) {
                if (err) {
                    if (err) {
                        res.status(403).json({ text: err });
                    }
                }
                else {
                    if (result0.length > 0) {
                        res.statusMessage = "found";
                        res.status(212).json({ text: 'Ya esta isncrito el estudiante' });
                    }
                    else {
                        const query = `INSERT INTO curso_alumno (id_alumno,id_curso,estado_curso_alumno,tx_id,tx_username,tx_host,tx_date)
                      VALUES (?,?,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP())`;
                        Database_1.default.query(query, [idAlumno, idCurso], function (err, result, fields) {
                            if (err) {
                                res.statusMessage = "sql err";
                                res.status(211).json({ text: 'No se pudo agregar al estudiante' });
                                throw err;
                            }
                            else {
                                const query2 = `SELECT id_curso_alumno  from curso_alumno where curso_alumno.id_curso=? and curso_alumno.id_alumno=?  and curso_alumno.estado_curso_alumno=true`;
                                Database_1.default.query(query2, [idCurso, idAlumno], function (err, result2, fields) {
                                    if (err) {
                                        res.status(403).json({ text: 'Error' });
                                    }
                                    else {
                                        res.status(200).json(result2);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
    insertarAsistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const q = `SELECT * FROM asistencia  INNER JOIN clase on
                asistencia.id_clase = clase.id_clase
                where id_curso = ? `;
            Database_1.default.query(q, [id], function (e, r, f) {
                if (e) {
                    res.status(500).json({ text: 'Error' });
                }
                else {
                    if (r.length > 0) {
                        res.status(200).json({ text: 'asistencias creadas' });
                    }
                    else {
                        const query = 'SELECT id_clase FROM clase WHERE id_curso = ? ';
                        Database_1.default.query(query, [id], function (err, result, fields) {
                            if (err) {
                                throw err;
                            }
                            else {
                                for (let i = 0; i < result.length; i++) {
                                    const query = 'SELECT id_alumno FROM curso_alumno WHERE id_curso =? and estado_curso_alumno =true';
                                    Database_1.default.query(query, [id], function (err1, result1, fields) {
                                        for (let j = 0; j < result1.length; j++) {
                                            const query3 = `INSERT INTO asistencia (id_clase,id_alumno,asistencia,estado_asistencia,tx_id,tx_username,tx_host,tx_date)
                            VALUES (?,?,false,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP())`;
                                            Database_1.default.query(query3, [result[i].id_clase, result1[j].id_alumno], function (err2, result2, fields2) {
                                                if (err2) {
                                                    res.status(500).json({ text: 'Error' });
                                                    throw err2;
                                                }
                                                else {
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }
    listaAlumnosAsistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fecha = req.body.fechaClase;
            const id = req.body.id;
            const query = `SELECT asistencia.id_clase_alumno ,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno, asistencia.asistencia
        FROM  asistencia INNER JOIN alumno ON 
        asistencia.id_alumno=alumno.id_alumno
        INNER JOIN clase ON
        clase.id_clase=asistencia.id_clase
        INNER JOIN curso ON
        curso.id_curso = clase.id_curso
        WHERE fecha_clase = '2020-02-16'
        AND estado_asistencia = true
        AND curso.id_curso=1`;
            Database_1.default.query(query, [fecha, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    listaFechasAsistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const queryFechas = `SELECT Month(fecha_clase) as mes 
        FROM  clase INNER JOIN curso ON
        curso.id_curso = clase.id_curso
        AND clase.estado_clase= true
        AND curso.id_curso=?
        group by mes`;
            Database_1.default.query(queryFechas, [id], function (errFecha, resultFecha, fieldsFecha) {
                if (errFecha) {
                    res.status(500).json({ text: errFecha });
                }
                else {
                    res.status(200).json(resultFecha);
                }
            });
        });
    }
    actualizarAsistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE asistencia SET asistencia = true WHERE id_clase_alumno = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error en la actualización' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Asistencia registrada' });
                }
            });
        });
    }
}
exports.classController = new ClassController();
//# sourceMappingURL=ClassController.js.map