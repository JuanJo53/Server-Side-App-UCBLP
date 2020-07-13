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
const Database_1 = __importDefault(require("../Database"));
const firebase = __importStar(require("firebase-admin"));
const Pregunta_1 = require("../model/Pregunta");
class TestController {
    agregarExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idTema = req.body.idTema;
            const numeroExamen = req.body.numeroExamen;
            const inicioExamen = req.body.inicioExamen;
            const finExamen = req.body.finExamen;
            const preguntasExamen = req.body.preguntasExamen;
            const query = `INSERT INTO examen_tema (id_tema,numero_examen,estado_examen,inicio_examen,fin_examen,tx_id,tx_username,tx_host,tx_date)
    VALUES (?,?,true,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [idTema, numeroExamen, inicioExamen, finExamen], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al crear el examen ' });
                    throw err;
                }
                else {
                    if (preguntasExamen != null && preguntasExamen.length > 0) {
                        console.log("Last ID " + result.insertId);
                        exports.testController.agregarPreguntasAExamenRecienCreado(req, res, result.insertId);
                    }
                    res.status(200).json({ text: 'Examen creado correctamente' });
                }
            });
        });
    }
    agregarPreguntasAExamenRecienCreado(req, res, idExamen) {
        return __awaiter(this, void 0, void 0, function* () {
            const preguntasExamen = req.body.preguntasExamen;
            const valores = [];
            const query = `INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host)
                VALUES ? `;
            for (let i = 0; i < preguntasExamen.length; i++) {
                valores.push([preguntasExamen[i].idPregunta, idExamen, preguntasExamen[i].puntuacion, true, 1, 'root', '192.168.0.10']);
            }
            Database_1.default.query(query, [valores], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al registrar las preguntas' });
                    throw err;
                }
                else {
                    //Do nothing
                }
            });
        });
    }
    modificarExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idExamen = req.body.idExamen;
            const numeroExamen = req.body.numeroExamen;
            const inicioExamen = req.body.inicioExamen;
            const finExamen = req.body.finExamen;
            const query = `UPDATE examen_tema SET numero_examen=? ,inicio_examen = ?,fin_examen =? , tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen =?`;
            Database_1.default.query(query, [numeroExamen, inicioExamen, finExamen, idExamen], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al modificar el examen' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Examen modificado correctamente' });
                }
            });
        });
    }
    eliminarExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE examen_tema SET estado_examen=false  WHERE id_examen =?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar el examen' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Examen eliminado correctamente' });
                }
            });
        });
    }
    cargarPreguntas(req) {
        let preg = new Pregunta_1.Pregunta();
        preg.pregunta = req.pregunta;
        preg.respuestas = req.respuestas;
        preg.opciones = req.opciones;
        if (req.archivo && req.archivo != null && req.archivo != 'undefined') {
            preg.archivo = req.archivo;
            console.log(req.archivo);
        }
        return preg;
    }
    agregarPregunta(cod, idTipo, idTipoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const codigoPregunta = cod;
            const idTipoPregunta = idTipo;
            const idTipoRespuesta = idTipoRes;
            const query = `insert into pregunta (codigo_pregunta,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host,tx_date)
        values (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
            Database_1.default.query(query, [codigoPregunta, idTipoPregunta, idTipoRespuesta], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return false;
                    }
                    else {
                        return result.insertId;
                    }
                });
            });
        });
    }
    agregarPreguntasExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idExamen = req.body.idExamen;
                const preguntasExamen = req.body.preguntasExamen;
                const query = `INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
                var c = 0;
                for (let i = 0; i < preguntasExamen.length; i++) {
                    var tipo_req = req.body.preguntasExamen[i].tipo;
                    if (tipo_req == true) {
                        Database_1.default.query(query, [req.body.preguntasExamen[i].id, idExamen, preguntasExamen[i].puntuacion], function (err, result, fields) {
                            if (err) {
                                res.status(500).json({ text: 'Error al agregar preguntas al examen' });
                                console.log(err);
                                return false;
                            }
                            else {
                                c++;
                                if (c == preguntasExamen.length) {
                                    console.log("entra 2");
                                    res.status(200).json({ text: 'Preguntas agregadas correctamente' });
                                    return true;
                                }
                            }
                        });
                    }
                    else {
                        const db = firebase.firestore();
                        let pregun = exports.testController.cargarPreguntas(req.body.preguntasExamen[i].body);
                        db.collection('Preguntas').add(JSON.parse(JSON.stringify(pregun))).then((val) => {
                            var data = preguntasExamen[i];
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
                                        Database_1.default.query(query, [result.insertId, idExamen, preguntasExamen[i].puntuacion], function (err2, result2, fields) {
                                            if (err2) {
                                                res.status(500).json({ text: 'Error al agregar preguntas al examen' });
                                                console.log(err2);
                                                return false;
                                            }
                                            else {
                                                c++;
                                                if (c == preguntasExamen.length) {
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
    modificarPreguntaExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idExamenPregunta = req.body.idExamenPregunta;
            const puntuacion = req.body.puntuacion;
            const query = `UPDATE examen_pregunta SET puntuacion_examen_pregunta = ? ,tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen_pregunta  =?`;
            Database_1.default.query(query, [puntuacion, idExamenPregunta], function (err, result, fields) {
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
    listarExamenes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT examen_tema.id_examen,examen_tema.inicio_examen,examen_tema.fin_examen
        FROM examen_tema INNER JOIN tema ON
        examen_tema.id_tema = tema.id_tema
        WHERE tema.id_tema = ?
        AND examen_tema.estado_examen=true`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los exámenes' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    eliminarPreguntaExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE examen_pregunta SET estado_examen_pregunta=false  WHERE id_examen_pregunta =?`;
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
    listarPreguntasExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT examen_pregunta.id_examen_pregunta,examen_pregunta.id_pregunta,pregunta.codigo_pregunta,
        examen_pregunta.puntuacion_examen_pregunta
        FROM examen_tema INNER JOIN examen_pregunta ON
        examen_tema.id_examen = examen_pregunta.id_examen
        INNER JOIN pregunta ON
        pregunta.id_pregunta = examen_pregunta.id_pregunta
        WHERE examen_pregunta.estado_examen_pregunta  = true
        AND examen_tema.id_examen=?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los exámenes' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.testController = new TestController();
//# sourceMappingURL=TestController.js.map