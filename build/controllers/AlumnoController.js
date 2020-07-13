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
const util_1 = __importDefault(require("util"));
class AlumnoController {
    listarModulos(idCurso, idAlumno, resultq) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT modulo.id_modulo,modulo.nombre_modulo, imagen.id_imagen,color.id_color ,modulo.id_tipo_modulo,nota_modulo.nota_modulo
        FROM  modulo 
        INNER JOIN nota_modulo ON 
        nota_modulo.id_modulo=modulo.id_modulo
        INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen 
        WHERE curso.id_curso = ?
        AND  curso.estado_curso!= 0
        AND nota_modulo.id_alumno = ?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [idAlumno, idCurso]);
                return row;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    obtenerPerfilAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idEstudianteCurso = req.body.idAlumnoCurso;
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
            AND ca.id_curso_alumno = ? `;
            try {
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result(query, idEstudianteCurso);
                var modulos = yield exports.alumnoController.listarModulos(idCurso, row[0].id_alumno, result);
                row[0].modulos = modulos;
                res.status(200).json(row[0]);
            }
            catch (e) {
                console.log(e);
            }
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
    obtenerPromedioAlumnoPracticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.body.idAlumno;
            const idCurso = req.body.idCurso;
            const query = `SELECT AVG(np.nota_practica) AS notaPromedioPracticas
        FROM nota_practica np 
        JOIN alumno alu ON
        np.id_alumno = alu.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        JOIN curso cur ON
        cur.id_curso = ca.id_curso
        WHERE np.estado_nota_practica=true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND alu.id_alumno = ?
        AND cur.id_curso = ?;`;
            Database_1.default.query(query, [idAlumno, idCurso], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al obtener nota del alumno' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    actualizarNotaModuloPracticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.body.idAlumno;
            const idCurso = req.body.idCurso;
            const idNotaModulo = req.body.idNotaModulo;
            const query = `UPDATE nota_modulo SET nota_modulo=(SELECT AVG(np.nota_practica)
        FROM nota_practica np 
        JOIN alumno alu ON
        np.id_alumno = alu.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        JOIN curso cur ON
        cur.id_curso = ca.id_curso
        WHERE np.estado_nota_practica=true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND alu.id_alumno = ?
        AND cur.id_curso = ?) where id_nota_modulo = ?;`;
            Database_1.default.query(query, [idAlumno, idCurso, idNotaModulo], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al actualizar la nota del alumno' });
                }
                else {
                    res.status(200).json({ text: 'Nota actualizada' });
                }
            });
        });
    }
}
exports.alumnoController = new AlumnoController();
//# sourceMappingURL=AlumnoController.js.map