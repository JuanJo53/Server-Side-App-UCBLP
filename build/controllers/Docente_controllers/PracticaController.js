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
            const practica = req.body.practica;
            const idLeccion = practica.idLeccion;
            const nombrePractica = practica.nombre;
            const numeroPractica = practica.numero;
            const inicioFecha = practica.fechaini;
            const inicioHora = practica.horaini;
            const finFecha = practica.fechafin;
            const finHora = practica.horafin;
            var tiempoLimite = null;
            if (practica.tiempoLimite != null) {
                tiempoLimite = practica.tiempoLimite + 1;
            }
            const preguntas = req.body.preguntas;
            const query = `INSERT INTO practica (
        tiempo_limite,
        id_leccion,
        nombre_practica,
        numero_practica,
        inicio_fecha,
        inicio_hora,
        fin_fecha,
        fin_hora,
        estado_practica,
        tx_id,tx_username,tx_host,tx_date)
    VALUES (?,?,?,?,?,?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [tiempoLimite, idLeccion, nombrePractica,
                numeroPractica, inicioFecha, inicioHora, finFecha, finHora], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ text: 'Error al crear la práctica ' });
                    }
                    else {
                        var resPract = yield exports.practicaController.agregarPreguntasPracticaSQL(result.insertId, preguntas);
                        if (resPract) {
                            res.status(200).json({ text: 'Se creo la practica correctamente' });
                        }
                        else {
                            res.status(500).json({ text: 'Error al crear la práctica ' });
                        }
                    }
                });
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
    agregarPreguntaRepo(preguntas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica,tx_id,tx_username,tx_host)
            VALUES ?;`;
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result(query, [preguntas]);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    agregarPreguntaNueva(preguntas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `insert into pregunta (codigo_pregunta,pregunta,opciones,respuesta,recurso,id_tipo_pregunta,id_tipo_respuesta,id_habilidad,estado_pregunta,tx_id,tx_username,tx_host)
            values ?;`;
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result(query, [preguntas]);
                var insId = row.insertId;
                console.log(insId);
                return insId;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    agregarNotaPractica(idPractica) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `insert into nota_practica (id_practica,id_alumno,nota_practica,estado_nota_practica,tx_id,tx_username,tx_host,tx_date)
        SELECT ?,alumno.id_alumno,0,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()
        FROM alumno INNER
        JOIN curso_alumno ON
        alumno.id_alumno=curso_alumno.id_alumno
        INNER JOIN curso ON
        curso.id_curso=curso_alumno.id_curso
        INNER JOIN tema ON
        tema.id_curso=curso.id_curso
        INNER JOIN leccion ON
        leccion.id_tema=tema.id_tema
        INNER JOIN practica ON
        practica.id_leccion=leccion.id_leccion
        WHERE practica.id_practica=?
        AND alumno.estado_alumno=true
        AND curso_alumno.estado_curso_alumno=true
        AND curso.estado_curso=true
        AND tema.estado_tema=true
        AND leccion.estado_leccion=true
        AND practica.estado_practica=true`;
            const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
            yield result(query, [idPractica, idPractica]);
        });
    }
    sacarPractica(idPractica, idDocente) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT practica.id_practica,practica.nombre_practica,practica.inicio_fecha,practica.fin_fecha,practica.inicio_hora,practica.fin_hora,practica.tiempo_limite
            FROM practica INNER JOIN leccion ON
            leccion.id_leccion = practica.id_leccion
            INNER JOIN tema ON
            tema.id_tema = leccion.id_tema
            INNER JOIN curso ON
            tema.id_curso = curso.id_curso
            INNER JOIN docente ON 
            docente.id_docente = curso.id_docente
            WHERE docente.id_docente = ?
            AND leccion.estado_leccion=true
            AND tema.estado_tema =true
            AND curso.estado_curso = true
            AND docente.estado_docente = true
            AND practica.id_practica=?`;
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [idDocente, idPractica]);
                console.log(row);
                return row[0];
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    obtenerPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            const practica = yield exports.practicaController.sacarPractica(Number(id), Number(idDocente));
            if (practica) {
                const query = `SELECT practica_pregunta.id_pregunta_practica,practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta
            ,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
            practica_pregunta.puntuacion_practica_pregunta,pregunta.pregunta,pregunta.respuesta,pregunta.opciones,pregunta.recurso ,pregunta.id_habilidad
            FROM practica INNER JOIN practica_pregunta ON
            practica.id_practica = practica_pregunta.id_practica
            INNER JOIN pregunta ON
            pregunta.id_pregunta = practica_pregunta.id_pregunta
            WHERE practica_pregunta.estado_pregunta_practica   = true
            AND practica.id_practica=?`;
                try {
                    const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                    var row = yield result2(query, [id]);
                    if (row.length == 0) {
                        res.status(200).json({ practica, preguntas: row });
                    }
                    else {
                        for (let preg of row) {
                            preg.opciones = JSON.parse(preg.opciones);
                            preg.respuesta = JSON.parse(preg.respuesta);
                        }
                        res.status(200).json({ practica, preguntas: row });
                    }
                }
                catch (e) {
                    console.log(e);
                    res.status(500).json({ text: 'No se pudo listar la practica' });
                }
            }
            else {
                res.status(500).json({ text: 'No se pudo listar la practica' });
            }
        });
    }
    agregarPreguntasPracticaSQL(idPractica, preguntas) {
        return __awaiter(this, void 0, void 0, function* () {
            const preguntasPractica = preguntas;
            var correcto = true;
            try {
                const preguntasRepo = [];
                const preguntasRepoNuevas = [];
                for (let i = 0; i < preguntasPractica.length; i++) {
                    var tipo_req = preguntasPractica[i].tipo;
                    if (tipo_req == 1) {
                        preguntasRepo.push([preguntasPractica[i].id, idPractica, preguntasPractica[i].puntuacion, true, 1, 'root', '192.168.0.10']);
                    }
                    else {
                        const preguntasNuevas = [];
                        var data = preguntasPractica[i];
                        const idTipoPregunta = data.idTipoPregunta;
                        const idTipoRespuesta = data.idTipoRespuesta;
                        const idHabilidad = data.idHabilidad;
                        const pregunta = data.pregunta;
                        const respuesta = JSON.stringify(data.respuesta);
                        const opciones = JSON.stringify(data.opciones);
                        const recurso = data.recurso;
                        preguntasNuevas.push([1, pregunta, opciones, respuesta, recurso, idTipoPregunta, idTipoRespuesta, idHabilidad, true, 1, 'root', '192.168.0.10']);
                        var resNuevo = yield exports.practicaController.agregarPreguntaNueva(preguntasNuevas);
                        if (resNuevo) {
                            preguntasRepoNuevas.push([resNuevo, idPractica, preguntasPractica[i].puntuacion, true, 1, 'root', '192.168.0.10']);
                        }
                        else {
                            correcto = false;
                        }
                    }
                }
                if (correcto) {
                    if (preguntasRepo.length != 0) {
                        yield exports.practicaController.agregarPreguntaRepo(preguntasRepo);
                    }
                    if (preguntasRepoNuevas.length != 0) {
                        yield exports.practicaController.agregarPreguntaRepo(preguntasRepoNuevas);
                    }
                    yield exports.practicaController.agregarNotaPractica(idPractica);
                    return true;
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
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
    eliminarPreguntas(preguntasEli) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (preguntasEli.length > 0) {
                    const queryEl = "UPDATE practica_pregunta SET estado_pregunta_practica = 0 WHERE id_pregunta_practica IN (?)";
                    const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                    yield result2(queryEl, [preguntasEli]);
                }
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    actualizarPregunta(pregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryEl = "UPDATE practica_pregunta SET puntuacion_practica_pregunta = ? WHERE id_pregunta_practica=?";
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                yield result2(queryEl, [pregunta.puntuacion, pregunta.id]);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    modificarPreguntas(preguntas, idPractica) {
        return __awaiter(this, void 0, void 0, function* () {
            const preguntasPractica = preguntas;
            var correcto = true;
            try {
                const preguntasRepo = [];
                const preguntasRepoNuevas = [];
                const promises = [];
                for (let i = 0; i < preguntasPractica.length; i++) {
                    var tipo_req = preguntasPractica[i].tipo;
                    if (tipo_req == 1) {
                        preguntasRepo.push([preguntasPractica[i].id, idPractica, preguntasPractica[i].puntuacion, true, 1, 'root', '192.168.0.10']);
                    }
                    else {
                        if (tipo_req == 0) {
                            const preguntasNuevas = [];
                            var data = preguntasPractica[i];
                            const idTipoPregunta = data.idTipoPregunta;
                            const idTipoRespuesta = data.idTipoRespuesta;
                            const idHabilidad = data.idHabilidad;
                            const pregunta = data.pregunta;
                            const respuesta = JSON.stringify(data.respuesta);
                            const opciones = JSON.stringify(data.opciones);
                            const recurso = data.recurso;
                            preguntasNuevas.push([1, pregunta, opciones, respuesta, recurso, idTipoPregunta, idTipoRespuesta, idHabilidad, true, 1, 'root', '192.168.0.10']);
                            var resNuevo = yield exports.practicaController.agregarPreguntaNueva(preguntasNuevas);
                            if (resNuevo) {
                                preguntasRepoNuevas.push([resNuevo, idPractica, preguntasPractica[i].puntuacion, true, 1, 'root', '192.168.0.10']);
                            }
                            else {
                                correcto = false;
                            }
                        }
                        else {
                            if (tipo_req == 2) {
                                promises.push(exports.practicaController.actualizarPregunta(preguntasPractica[i]));
                            }
                        }
                    }
                }
                const responses = yield Promise.all(promises);
                if (responses.includes(false)) {
                    correcto = false;
                }
                if (correcto) {
                    if (preguntasRepo.length != 0) {
                        yield exports.practicaController.agregarPreguntaRepo(preguntasRepo);
                    }
                    if (preguntasRepoNuevas.length != 0) {
                        yield exports.practicaController.agregarPreguntaRepo(preguntasRepoNuevas);
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    modificarPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const practica = req.body.practica;
            const idPractica = practica.id;
            const nombrePractica = practica.nombre;
            const inicioFecha = practica.fechaini;
            const inicioHora = practica.horaini;
            const finFecha = practica.fechafin;
            const finHora = practica.horafin;
            var tiempoLimite = null;
            if (practica.tiempoLimite != null) {
                tiempoLimite = practica.tiempoLimite + 1;
            }
            const preguntas = req.body.preguntas;
            const query = `UPDATE practica 
        set tiempo_limite=?,
        nombre_practica=?,
        inicio_fecha=?,
        inicio_hora=?,
        fin_fecha=?,
        fin_hora=?
        WHERE id_practica=?
        `;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                yield result2(query, [tiempoLimite, nombrePractica, inicioFecha, inicioHora, finFecha, finHora, idPractica]);
                var pregEli = yield exports.practicaController.eliminarPreguntas(req.body.preguntasEli);
                var pregRes = yield exports.practicaController.modificarPreguntas(preguntas, idPractica);
                if (pregEli && pregRes) {
                    res.status(200).json("Practica modificada correctamente");
                }
                else {
                    res.status(500).json("No se pudo modificar la practica");
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json("No se pudo modificar la practica");
            }
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
            console.log(idDocente);
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
        AND tema.estado_tema =true
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        ORDER BY practica.inicio_fecha DESC`;
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
            const query = `SELECT ntp.id_nota_practica,ntp.nota_practica,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno,ntp.practica_dada
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
        practica_pregunta.puntuacion_practica_pregunta, pregunta.pregunta,pregunta.opciones
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
    respuestasEstudiante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            console.log(id);
            var query = `SELECT pregunta.pregunta,practica_pregunta.puntuacion_practica_pregunta, pregunta.id_tipo_respuesta,pregunta.id_tipo_pregunta,
        pregunta_respuesta.respuesta as alumno_respuesta,pregunta_respuesta.puntaje,pregunta.opciones,pregunta.respuesta
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
        INNER JOIN nota_practica ON
        nota_practica.id_practica=practica.id_practica
        INNER JOIN pregunta_respuesta ON
        pregunta_respuesta.id_pregunta_practica=practica_pregunta.id_pregunta_practica
        and pregunta_respuesta.id_alumno=nota_practica.id_alumno
        WHERE practica_pregunta.estado_pregunta_practica= true
        AND practica.estado_practica = true
        AND leccion.estado_leccion=true
        AND tema.estado_tema !=false
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        AND nota_practica.estado_nota_practica=true
        AND pregunta_respuesta.estado_pregunta_respuesta=true
        AND nota_practica.id_nota_practica=?
        AND docente.id_docente = ?;`;
            const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
            try {
                var row = yield result2(query, [id, idDocente]);
                for (let preg of row) {
                    preg.respuesta = JSON.parse(preg.respuesta);
                    preg.opciones = JSON.parse(preg.opciones);
                    preg.alumno_respuesta = JSON.parse(preg.alumno_respuesta);
                }
                res.status(200).json(row);
            }
            catch (e) {
                res.status(500).json({ text: 'No se pudo listar las respuestas' });
            }
        });
    }
}
exports.practicaController = new PreacticaController();
//# sourceMappingURL=PracticaController.js.map