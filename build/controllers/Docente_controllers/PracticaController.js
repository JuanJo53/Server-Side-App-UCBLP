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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../../Database"));
const firebase = __importStar(require("firebase-admin"));
const Pregunta_1 = require("../../model/Pregunta");
const util_1 = __importDefault(require("util"));
class PreacticaController {
    agregarPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idLeccion = req.body.idLeccion;
            const nombrePractica = req.body.nombre;
            const numeroPractica = req.body.numero;
            const inicioFecha = req.body.fechaini;
            const inicioHora = req.body.horaini;
            const finFecha = req.body.fechafin;
            const finHora = req.body.horafin;
            const query = `INSERT INTO practica (
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
            Database_1.default.query(query, [idLeccion, nombrePractica,
                numeroPractica, inicioFecha, inicioHora, finFecha, finHora], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'Error al crear la práctica ' });
                }
                else {
                    res.status(200).json({ idPractica: result.insertId });
                }
            });
        });
    }
    agregarPreguntasAPracticaRecienCreada(req, res, idPractica) {
        return __awaiter(this, void 0, void 0, function* () {
            const preguntasPractica = req.body.preguntasPractica;
            console.log(preguntasPractica);
            var valores = [];
            const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica ,tx_id,tx_username,tx_host)
        VALUES ?`;
            for (let i = 0; i < preguntasPractica.length; i++) {
                valores.push([preguntasPractica[i].idPregunta, idPractica, preguntasPractica[i].puntuacion, true, 1, 'root', '192.168.0.10']);
            }
            Database_1.default.query(query, [valores], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al agregar preguntas a la práctica' });
                    throw err;
                }
                else {
                    //do Nothing    
                }
            });
        });
    }
    cargarPreguntas(req) {
        let preg = new Pregunta_1.Pregunta();
        preg.pregunta = req.pregunta;
        preg.respuestas = req.respuesta;
        preg.opciones = req.opciones;
        if (req.archivo && req.archivo != null && req.archivo !== 'undefined') {
            preg.archivo = req.archivo;
            console.log(req.archivo);
        }
        return preg;
    }
    agregarPreguntasPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idPractica = req.body.idPractica;
                const preguntasPractica = req.body.preguntas;
                const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
                var c = 0;
                for (let i = 0; i < preguntasPractica.length; i++) {
                    var tipo_req = req.body.preguntas[i].tipo;
                    console.log(tipo_req);
                    if (tipo_req) {
                        Database_1.default.query(query, [req.body.preguntas[i].id, idPractica, preguntasPractica[i].puntuacion], function (err, result, fields) {
                            if (err) {
                                res.status(500).json({ text: 'Error al agregar preguntas al examen' });
                                console.log(err);
                                return false;
                            }
                            else {
                                c++;
                                if (c == preguntasPractica.length) {
                                    console.log("entra 2");
                                    res.status(200).json({ text: 'Preguntas agregadas correctamente' });
                                    return true;
                                }
                            }
                        });
                    }
                    else {
                        const db = firebase.firestore();
                        let pregun = exports.practicaController.cargarPreguntas(req.body.preguntas[i]);
                        db.collection('Preguntas').add(JSON.parse(JSON.stringify(pregun))).then((val) => {
                            var data = preguntasPractica[i];
                            const codigoPregunta = val.id;
                            const idTipoPregunta = data.idTipoPregunta;
                            const idTipoRespuesta = data.idTipoRespuesta;
                            const query2 = `insert into pregunta (codigo_pregunta,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host,tx_date)
                    values (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
                            Database_1.default.query(query2, [codigoPregunta, idTipoPregunta, idTipoRespuesta], function (err, result, fields) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (err) {
                                        res.status(500).json("Ocurrio un Error al Agregar la pregunta");
                                        console.log(err);
                                        return false;
                                    }
                                    else {
                                        Database_1.default.query(query, [result.insertId, idPractica, preguntasPractica[i].puntuacion], function (err2, result2, fields) {
                                            if (err2) {
                                                res.status(500).json({ text: 'Error al agregar preguntas al examen' });
                                                console.log(err2);
                                                return false;
                                            }
                                            else {
                                                c++;
                                                if (c == preguntasPractica.length) {
                                                    console.log("entra 2");
                                                    res.status(200).json({ text: 'Preguntas agregadas correctamente' });
                                                    return false;
                                                }
                                            }
                                        });
                                    }
                                });
                            });
                        }).catch((err) => {
                            res.status(500).json("Ocurrio un Error al Agregar la pregunta");
                            console.log(err);
                            return false;
                        });
                    }
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json("Ocurrio un Error al Agregar la pregunta");
            }
        });
    }
    modificarPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idPractica = req.body.idPractica;
            const nombrePractica = req.body.nombrePractica;
            const numeroPractica = req.body.numeroPractica;
            const inicioFecha = req.body.inicioFecha;
            const finFecha = req.body.finFecha;
            const inicioHora = req.body.inicioHora;
            const finHora = req.body.finhora;
            const query = `UPDATE practica SET nombre_practica = ?,numero_practica=?,inicio_fecha =?,
        inicio_hora=?,fin_fecha =?,fin_hora=? WHERE id_practica =?`;
            Database_1.default.query(query, [nombrePractica, numeroPractica, inicioFecha, inicioHora, finFecha, finHora, idPractica], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al modificar la práctica' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Práctica modificada correctamente' });
                }
            });
        });
    }
    eliminarPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE practica SET estado_practica=false  WHERE id_practica =?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar la práctica' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Práctica eliminada correctamente' });
                }
            });
        });
    }
    modificarPreguntaPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idPracticaPregunta = req.body.idPracticaPregunta;
            const puntuacion = req.body.puntuacion;
            const query = `UPDATE practica_pregunta SET puntuacion_practica_pregunta = ? ,tx_date = CURRENT_TIMESTAMP()
        WHERE id_pregunta_practica   =?`;
            Database_1.default.query(query, [puntuacion, idPracticaPregunta], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo modificar la pregunta' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Pregunta modificada correctamente' });
                }
            });
        });
    }
    listarPracticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            console.log(id);
            const query = `SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica 
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema = leccion.id_tema
        INNER JOIN curso ON
        tema.id_curso = curso.id_curso
        INNER JOIN docente ON 
        docente.id_docente = curso.id_docente
        WHERE leccion.id_leccion=?
        AND docente.id_docente = ?
        AND practica.estado_practica=true
        AND leccion.estado_leccion=true
        AND tema.estado_tema !=false
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        ORDER BY practica.numero_practica ASC`;
            Database_1.default.query(query, [id, idDocente], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'No se pudo listar las practicas' });
                }
                else {
                    console.log(result);
                    res.status(200).json(result);
                }
            });
        });
    }
    listarNotasPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idDocente = req.docenteId;
            const { id } = req.params;
            const query = `SELECT ntp.id_nota_practica,ntp.nota_practica,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno
        FROM nota_practica ntp
        INNER JOIN practica ON
        practica.id_practica=ntp.id_practica
        INNER JOIN leccion ON
        leccion.id_leccion=practica.id_leccion
        INNER JOIN tema ON
        leccion.id_tema=tema.id_tema
        INNER JOIN curso ON
        curso.id_curso=tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        alumno.id_alumno=curso_alumno.id_alumno
        AND alumno.id_alumno=ntp.id_alumno
        WHERE practica.estado_practica = true
        AND leccion.estado_leccion=true
        AND curso.estado_curso=true
        AND curso.id_docente=?        
        AND ntp.estado_nota_practica=true
        AND ntp.id_practica=?
        AND tema.estado_tema = true`;
            try {
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result(query, [idDocente, id]);
                res.status(200).json(row);
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'Error al listar las notas de la practica' });
            }
        });
    }
    eliminarPreguntaPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE practica_pregunta SET estado_pregunta_practica=false  WHERE id_pregunta_practica  =?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar la pregunta' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Pregunta eliminada correctamente' });
                }
            });
        });
    }
    listarPreguntasPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            const query = `SELECT practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema = leccion.id_tema
        INNER JOIN curso ON
        tema.id_curso = curso.id_curso
        INNER JOIN docente ON 
        docente.id_docente = curso.id_docente
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND practica.estado_practica = true
        AND leccion.estado_leccion=true
        AND tema.estado_tema !=false
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        AND practica.id_practica=?
        AND docente.id_docente = ?;`;
            Database_1.default.query(query, [id, idDocente], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(500).json({ text: 'No se pudo listar los exámenes' });
                    }
                    else {
                        res.status(200).json(result);
                    }
                });
            });
        });
    }
}
exports.practicaController = new PreacticaController();
//# sourceMappingURL=PracticaController.js.map