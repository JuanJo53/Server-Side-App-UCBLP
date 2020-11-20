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
const Database_1 = __importDefault(require("../../Database"));
class TemaAlumnoController {
    listarTemas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idAlumno = req.estudianteId;
            const query = `SELECT tm.id_tema,tm.numero_tema,tm.nombre_tema,tm.id_imagen,tm.estado_tema 
        FROM tema tm 
        INNER JOIN curso cur ON
        cur.id_curso=tm.id_curso
        INNER JOIN curso_alumno ca ON
        ca.id_curso = cur.id_curso
        INNER JOIN alumno alu ON
        ca.id_alumno = alu.id_alumno  
        WHERE cur.id_curso = ?
        AND (tm.estado_tema=true OR tm.estado_tema=2)
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND alu.estado_alumno = true
        AND alu.id_alumno = ?
        ORDER BY tm.numero_tema ASC`;
            Database_1.default.query(query, [id, idAlumno], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar los temas' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.temaAlumnoController = new TemaAlumnoController();
//# sourceMappingURL=TemaAlumnoController.js.map