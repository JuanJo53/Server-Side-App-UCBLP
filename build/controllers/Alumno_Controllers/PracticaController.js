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
const util_1 = __importDefault(require("util"));
class PracticaController {
    listarPracticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idEstudiante = req.estaudianteId;
            const query = `SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE leccion.id_leccion=5
        AND practica.estado_practica=true
        AND leccion.estado_leccion = ?
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?`;
            Database_1.default.query(query, [id, idEstudiante], function (err, result, fields) {
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
    obtenerPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND practica.id_practica=?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [id]);
                if (row.length == 0) {
                    res.status(500).json({ text: 'No esta habilitado para ver esta practica' });
                }
                else {
                    var listaPreg = [];
                    for (let preg of row) {
                        listaPreg.push(preg.codigo_pregunta);
                    }
                    const db = firebase.firestore();
                    var datos = yield db.collection('Preguntas').where(firebase.firestore.FieldPath.documentId(), "in", listaPreg).get();
                    for (let preg in row) {
                        row[preg].pregunta = datos.docs[preg].data();
                    }
                    res.status(200).json(row);
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'No se pudo listar la practica' });
            }
        });
    }
}
exports.practicaController = new PracticaController();
//# sourceMappingURL=PracticaController.js.map