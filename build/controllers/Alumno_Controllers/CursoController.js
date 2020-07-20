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
class CursoAlumnoController {
    listarCursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.estudianteId;
            const query = `SELECT curso.nombre_curso,curso.id_curso
        FROM curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso = curso.id_curso
        INNER JOIN alumno ON
        alumno.id_alumno = curso_alumno.id_alumno
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.estado_alumno = true
        AND alumno.id_alumno = ?`;
            Database_1.default.query(query, [idAlumno], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'Error al cargar las lecciones' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.cursoAlumnoController = new CursoAlumnoController();
//# sourceMappingURL=CursoController.js.map