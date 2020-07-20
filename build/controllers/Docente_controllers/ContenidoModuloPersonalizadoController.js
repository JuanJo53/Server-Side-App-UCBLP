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
const util_1 = __importDefault(require("util"));
class ContenidoModuloPersonalizadoController {
    agregarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idModulo = req.body.idModulo;
            const numeroContenido = 0;
            const nombreContenido = req.body.nombreContenido;
            const rubricaContenido = 0;
            const query = `INSERT INTO contenido_mod_per (id_modulo,numero_contenido,nombre_contenido,rubrica_contenido,estado_contenido_mod_per,tx_id,tx_username,tx_host)
        VALUES (?,?,?,?,1,1,'root','192.168.0.10')`;
            Database_1.default.query(query, [idModulo, numeroContenido, nombreContenido, rubricaContenido], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al agregar contenido' });
                }
                else {
                    res.status(200).json({ text: 'Contenido agregado correctamente' });
                }
            });
        });
    }
    cambiarRubrica(id, rubricaContenido) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE contenido_mod_per SET rubrica_contenido = ? WHERE id_contenido_mod_per = ?`;
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result(query, [rubricaContenido, id]);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    actualizarRubricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const rubricas = req.body;
            try {
                var error = false;
                const promises = [];
                for (let rubrica of rubricas) {
                    promises.push(exports.contenidoModuloPersonalizadoController.cambiarRubrica(rubrica.id_contenido_mod_per, rubrica.rubrica_contenido));
                }
                const responses = yield Promise.all(promises);
                if (responses.includes(false)) {
                    res.status(500).json({ text: 'Error al obtener la lista de alumnos' });
                }
                else {
                    res.status(200).json({ text: 'se modficaron correctamente las rubricas' });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'Error al obtener la lista de alumnos' });
            }
        });
    }
    desactivarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE contenido_mod_per SET estado_contenido_mod_per = 2 WHERE id_contenido_mod_per =? `;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al desactivar contenido' });
                }
                else {
                    res.status(200).json({ text: 'Contenido desactivado correctamente' });
                }
            });
        });
    }
    activarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE contenido_mod_per SET estado_contenido_mod_per = 1 WHERE id_contenido_mod_per =? `;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al activar contenido' });
                }
                else {
                    res.status(200).json({ text: 'Contenido activado correctamente' });
                }
            });
        });
    }
    eliminarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE contenido_mod_per SET estado_contenido_mod_per = 0 WHERE id_contenido_mod_per =? `;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar contenido' });
                }
                else {
                    res.status(200).json({ text: 'Contenido eliminado correctamente' });
                }
            });
        });
    }
    modificarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const idContenidoModPer = req.body.id;
            const numeroContenido = 0;
            const nombreContenido = req.body.nombreContenido;
            const query = `UPDATE contenido_mod_per SET nombre_contenido = ? , numero_contenido = ? WHERE id_contenido_mod_per =? `;
            Database_1.default.query(query, [nombreContenido, numeroContenido, idContenidoModPer], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar contenido' });
                }
                else {
                    res.status(200).json({ text: 'Contenido eliminado correctamente' });
                }
            });
        });
    }
    listarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idModulo = req.body.idModulo;
            const query = `SELECT cont.id_contenido_mod_per, cont.numero_contenido,cont.nombre_contenido,cont.rubrica_contenido
        FROM contenido_mod_per cont
        JOIN modulo modu ON
        cont.id_modulo=modu.id_modulo
        JOIN curso cur ON
        cur.id_curso = modu.id_curso
        WHERE cur.estado_curso=true
        AND modu.estado_modulo!=0
        AND cont.estado_contenido_mod_per!=0
        AND cur.id_curso = ?
        AND modu.id_modulo=?`;
            Database_1.default.query(query, [idCurso, idModulo], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar contenido' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    agregarNotaAContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idContenidoModPer = req.body.idContenidoModPer;
            const idAlumno = req.body.idAlumno;
            const notaContenido = req.body.notaContenido;
            const query = `INSERT INTO nota_contenido (id_contenido_mod_per,id_alumno,nota_contenido,estado_nota_contenido,tx_id,tx_username,tx_host)
        VALUES (?,?,?,true,1,'root','192.168.0.10')`;
            Database_1.default.query(query, [idContenidoModPer, idAlumno, notaContenido], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al agregar la nota' });
                }
                else {
                    res.status(200).json({ text: 'Nota agregada correctamente' });
                }
            });
        });
    }
    modificarNotaContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idNotaContenido = req.body.idNotaContenido;
            const notaContenido = req.body.notaContenido;
            const query = `UPDATE nota_contenido SET nota_contenido = ? WHERE id_nota_contenido=?`;
            Database_1.default.query(query, [idNotaContenido, notaContenido], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al modificar la nota' });
                }
                else {
                    res.status(200).json({ text: 'Nota modificada correctamente' });
                }
            });
        });
    }
    eliminarNotaContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idNotaContenido = req.body.idNotaContenido;
            const notaContenido = req.body.notaContenido;
            const query = `UPDATE nota_contenido SET estado_nota_contenido = 0 WHERE id_nota_contenido=?`;
            Database_1.default.query(query, [idNotaContenido, notaContenido], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar la nota' });
                }
                else {
                    res.status(200).json({ text: 'Nota eliminada correctamente' });
                }
            });
        });
    }
    obtenerPromedioNotasContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idModulo = req.body.idModulo;
            const query = `SELECT alu.id_alumno,alu.nombre_alumno,alu.ap_paterno_alumno,alu.ap_materno_alumno,sum(nc.nota_contenido*cmp.rubrica_contenido/100) as nota
        FROM nota_contenido nc 
        JOIN alumno alu ON
        alu.id_alumno =nc.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno = alu.id_alumno
        JOIN curso cur ON 
        ca.id_curso = cur.id_curso
        JOIN modulo modu ON
        modu.id_curso = cur.id_curso
        JOIN tipo_modulo tm ON
        tm.id_tipo_modulo =modu.id_tipo_modulo
        JOIN contenido_mod_per cmp ON
        cmp.id_modulo = modu.id_modulo 
        WHERE nc.estado_nota_contenido =true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso = true
        AND modu.estado_modulo=1
        AND tm.estado_tipo_modulo = true
        AND cmp.estado_contenido_mod_per=1
        AND cur.id_curso = 1
        AND modu.id_modulo = 28
        AND tm.id_tipo_modulo = 2
        GROUP BY alu.id_alumno,alu.nombre_alumno,alu.ap_paterno_alumno,alu.ap_materno_alumno`;
            Database_1.default.query(query, [idCurso, idModulo], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al obtaner la nota' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    obtenerPromedioContenidoPorAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.body.idAlumno;
            const idCurso = req.body.idCurso;
            const idModulo = req.body.idModulo;
            const query = `SELECT  cmp.numero_contenido,cmp.nombre_contenido,SUM(nc.nota_contenido*cmp.rubrica_contenido/100) as promedio
        FROM nota_contenido nc 
        JOIN alumno alu ON
        alu.id_alumno =nc.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno = alu.id_alumno
        JOIN curso cur ON 
        ca.id_curso = cur.id_curso
        JOIN modulo modu ON
        modu.id_curso = cur.id_curso
        JOIN tipo_modulo tm ON
        tm.id_tipo_modulo =modu.id_tipo_modulo
        JOIN contenido_mod_per cmp ON
        cmp.id_modulo = modu.id_modulo 
        WHERE nc.estado_nota_contenido =true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso = true
        AND modu.estado_modulo=1
        AND tm.estado_tipo_modulo = true
        AND cmp.estado_contenido_mod_per=1
        AND cur.id_curso = ?
        AND cmp.id_contenido_mod_per = 1
        AND alu.id_alumno = ?
        AND tm.id_tipo_modulo = 2
        AND modu.id_modulo =?
        GROUP BY cmp.numero_contenido,cmp.nombre_contenido;`;
            Database_1.default.query(query, [idCurso, idAlumno, idModulo], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al obtener las notas' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.contenidoModuloPersonalizadoController = new ContenidoModuloPersonalizadoController();
//# sourceMappingURL=ContenidoModuloPersonalizadoController.js.map