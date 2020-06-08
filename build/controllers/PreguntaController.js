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
class PreguntaController {
    listarTipoPregunta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id_tipo_pregunta,tipo_pregunta FROM tipo_pregunta WHERE estado_tipo_pregunta = true';
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar tipos de pregunta' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    listarTipoRespuesta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id_tipo_respuesta,tipo_respuesta FROM tipo_respuesta WHERE estado_tipo_respuesta = true';
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar tipos de respuesta' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    agregarPregunta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const codigoPregunta = req.body.codigoPregunta;
            const idTipoPregunta = req.body.idTipoPregunta;
            const idTipoRespuesta = req.body.idTipoRespuesta;
            const query = `insert into pregunta (codigo_pregunta,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host,tx_date)
        values (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
            Database_1.default.query(query, [codigoPregunta, idTipoPregunta, idTipoRespuesta], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al crear la pregutna' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Pregunta creada correctamente' });
                }
            });
        });
    }
    listarPreguntas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT pregunta.id_pregunta,pregunta.codigo_pregunta,tipo_pregunta.tipo_pregunta,tipo_respuesta.tipo_respuesta 
        FROM tipo_pregunta INNER JOIN pregunta ON
        tipo_pregunta.id_tipo_pregunta= pregunta.id_tipo_pregunta
        INNER JOIN tipo_respuesta ON
        tipo_respuesta.id_tipo_respuesta = pregunta.id_tipo_respuesta
        WHERE pregunta.estado_pregunta = true`;
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar las preguntas' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.preguntaController = new PreguntaController();
//# sourceMappingURL=PreguntaController.js.map