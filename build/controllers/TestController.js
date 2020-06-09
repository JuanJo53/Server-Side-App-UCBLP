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
class TestControloler {
    agregarExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idTema = req.body.idTema;
            const inicioExamen = req.body.inicioExamen;
            const finExamen = req.body.finExamen;
            const preguntasExamen = req.body.preguntasExamen;
            const query = `INSERT INTO examen_tema (id_tema,estado_examen,inicio_examen,fin_examen,tx_id,tx_username,tx_host,tx_date)
    VALUES (?,true,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [idTema, inicioExamen, finExamen], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al crear el examen ' });
                    throw err;
                }
                else {
                    if (preguntasExamen != null && preguntasExamen.length > 0) {
                        const query2 = `INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host,tx_date)
                VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
                        console.log("Last ID " + result.insertId);
                        for (let i = 0; i < preguntasExamen.length; i++) {
                            Database_1.default.query(query2, [preguntasExamen[i].idPregunta, result.insertId, preguntasExamen[i].puntuacion], function (err2, result2, fields2) {
                                if (err2) {
                                    res.status(500).json({ text: 'Error al registrar las preguntas' });
                                    throw err2;
                                }
                                else {
                                    //Do nothing
                                }
                            });
                        }
                    }
                    res.status(200).json({ text: 'Examen creado correctamente' });
                }
            });
        });
    }
    modificarExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idExamen = req.body.idExamen;
            const inicioExamen = req.body.inicioExamen;
            const finExamen = req.body.finExamen;
            const query = `UPDATE examen_tema SET inicio_examen = ?,fin_examen =? , tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen =?`;
            Database_1.default.query(query, [inicioExamen, finExamen, idExamen], function (err, result, fields) {
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
    agregarPreguntasExamen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idExamen = req.body.idExamen;
            const preguntasExamen = req.body.preguntasExamen;
            console.log(idExamen);
            console.log(preguntasExamen[0].idPregunta);
            console.log(preguntasExamen[0].puntuacion);
            const query = `INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            for (let i = 0; i < preguntasExamen.length; i++) {
                Database_1.default.query(query, [preguntasExamen[i].idPregunta, idExamen, preguntasExamen[i].puntuacion], function (err, result, fields) {
                    if (err) {
                        res.status(500).json({ text: 'Error al agregar preguntas al examen' });
                        throw err;
                    }
                    else {
                        if ((i + 1) == preguntasExamen.length) {
                            res.status(200).json({ text: 'Preguntas agregadas correctamente' });
                        }
                    }
                });
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
exports.testController = new TestControloler();
//# sourceMappingURL=TestController.js.map