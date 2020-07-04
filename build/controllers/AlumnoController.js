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
class AlumnoController {
    obtenerPerfilAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.body.idAlumno;
            const idCurso = req.body.idCurso;
            const query = `SELECT alu.id_alumno,alu.nombre_alumno,alu.ap_paterno_alumno ,alu.ap_materno_alumno ,alu.correo_alumno 
        FROM alumno alu
        JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        JOIN curso cur ON
        ca.id_curso=cur.id_curso
        WHERE alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND alu.id_alumno = ?
        AND cur.id_curso = ?`;
            Database_1.default.query(query, [idAlumno, idCurso], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al obtener el perfil del alumno' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    obtenerCalificacionesAlumnoModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.body.idAlumno;
            const idCurso = req.body.idCurso;
            const query = `SELECT nmod.id_nota_modulo,nmod.nota_modulo, modu.nombre_modulo 
        FROM nota_modulo nmod
        JOIN modulo modu ON
        nmod.id_modulo = modu.id_modulo
        JOIN alumno alu ON
        alu.id_alumno = nmod.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        JOIN curso cur ON
        cur.id_curso = ca.id_curso
        WHERE modu.estado_modulo = true
        AND nmod.estado_nota_modulo=true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND alu.id_alumno = ?
        AND cur.id_curso = ?;`;
            Database_1.default.query(query, [idAlumno, idCurso], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al obtener el perfil del alumno' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.alumnoController = new AlumnoController();
//# sourceMappingURL=AlumnoController.js.map