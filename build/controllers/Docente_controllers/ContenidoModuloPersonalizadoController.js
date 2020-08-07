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
    listarNotasContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            const query = `SELECT alumno.id_alumno,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno,nota_contenido.nota_contenido,nota_contenido.id_nota_contenido,modulo.nombre_modulo
        FROM alumno INNER
        JOIN curso_alumno ON
        alumno.id_alumno=curso_alumno.id_alumno INNER
        JOIN curso ON
        curso.id_curso=curso_alumno.id_curso
        INNER JOIN modulo ON
        modulo.id_curso=curso.id_curso
        INNER JOIN contenido_mod_per ON
        contenido_mod_per.id_modulo=modulo.id_modulo
        INNER JOIN nota_contenido ON
        nota_contenido.id_contenido_mod_per=contenido_mod_per.id_contenido_mod_per 
        INNER JOIN docente ON
        curso.id_docente = docente.id_docente
        AND nota_contenido.id_alumno=alumno.id_alumno
        WHERE curso_alumno.estado_curso_alumno=true
        AND curso.estado_curso=true
        AND modulo.estado_modulo=true
        AND contenido_mod_per.estado_contenido_mod_per=true
        AND contenido_mod_per.id_contenido_mod_per= ?
        AND docente .id_docente = ?
        AND nota_contenido.estado_nota_contenido=true
        AND docente.estado_docente = true
        ORDER BY alumno.ap_paterno_alumno`;
            try {
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                const resultado = yield result(query, [id, idDocente]);
                res.status(200).json(resultado);
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'Error al listar contenido' });
            }
        });
    }
    agregarNotasContenidoNuevo(idContenidoModulo) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `insert into nota_contenido (id_alumno,id_contenido_mod_per,nota_contenido,estado_nota_contenido,tx_id,tx_username,tx_host,tx_date)
            SELECT alumno.id_alumno,?,0,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()
            FROM alumno INNER
            JOIN curso_alumno ON
            alumno.id_alumno=curso_alumno.id_alumno INNER
            JOIN curso ON
            curso.id_curso=curso_alumno.id_curso
            INNER JOIN modulo ON
            modulo.id_curso=curso.id_curso
            INNER JOIN contenido_mod_per ON
            contenido_mod_per.id_modulo=modulo.id_modulo
            WHERE curso_alumno.estado_curso_alumno=true
            AND curso.estado_curso=true
            AND modulo.estado_modulo=true
            AND contenido_mod_per.estado_contenido_mod_per=true
            AND contenido_mod_per.id_contenido_mod_per=?
            GROUP BY alumno.id_alumno`;
            try {
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                yield result(query, [idContenidoModulo, idContenidoModulo]);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    agregarContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idModulo = req.body.idModulo;
            const numeroContenido = 0;
            const nombreContenido = req.body.nombreContenido;
            const rubricaContenido = 0;
            const query = `INSERT INTO contenido_mod_per (id_modulo,numero_contenido,nombre_contenido,rubrica_contenido,estado_contenido_mod_per,tx_id,tx_username,tx_host)
        VALUES (?,?,?,?,1,1,'root','192.168.0.10')`;
            Database_1.default.query(query, [idModulo, numeroContenido, nombreContenido, rubricaContenido], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(500).json({ text: 'Error al agregar contenido' });
                    }
                    else {
                        var resAgregar = yield exports.contenidoModuloPersonalizadoController.agregarNotasContenidoNuevo(result.insertId);
                        if (resAgregar) {
                            res.status(200).json({ id: result.insertId });
                        }
                        else {
                            res.status(500).json({ text: 'Error al agregar contenido' });
                        }
                    }
                });
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
    actualizarNotaModulo() {
    }
    actualizarRubricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const rubricas = req.body.rubricas;
            const idModulo = req.body.idModulo;
            try {
                var error = false;
                const promises = [];
                for (let rubrica of rubricas) {
                    promises.push(exports.contenidoModuloPersonalizadoController.cambiarRubrica(rubrica.id, rubrica.rubrica));
                }
                const responses = yield Promise.all(promises);
                if (responses.includes(false)) {
                    res.status(500).json({ text: 'Error al obtener la lista de alumnos' });
                }
                else {
                    var resuNot = yield exports.contenidoModuloPersonalizadoController.anadirNotaModuloTotal(idModulo);
                    if (resuNot) {
                        res.status(200).json({ text: 'Se modificaron correctamente las rubricas' });
                    }
                    else {
                        res.status(500).json({ text: 'Error al obtener la lista de alumnos' });
                    }
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
            const idModulo = req.body.idModulo;
            console.log(idModulo);
            const query = `UPDATE contenido_mod_per SET estado_contenido_mod_per = 0 WHERE id_contenido_mod_per =? `;
            Database_1.default.query(query, [id], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(500).json({ text: 'Error al eliminar contenido' });
                    }
                    else {
                        var resTota = yield exports.contenidoModuloPersonalizadoController.anadirNotaModuloTotal(idModulo);
                        if (resTota) {
                            res.status(200).json({ text: 'Contenido eliminado correctamente' });
                        }
                        else {
                            res.status(500).json({ text: 'Error al eliminar contenido' });
                        }
                        res.status(200).json({ text: 'Contenido eliminado correctamente' });
                    }
                });
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
            const idDocente = req.docenteId;
            const query = `SELECT cont.id_contenido_mod_per, cont.numero_contenido,cont.nombre_contenido,cont.rubrica_contenido
        FROM contenido_mod_per cont
        JOIN modulo modu ON
        cont.id_modulo=modu.id_modulo
        JOIN curso cur ON
        cur.id_curso = modu.id_curso
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        WHERE cur.estado_curso=true
        AND modu.estado_modulo!=0
        AND cont.estado_contenido_mod_per!=0
        AND cur.id_curso = ?
        AND modu.id_modulo= ?
        AND dc.id_docente = ?`;
            Database_1.default.query(query, [idCurso, idModulo, idDocente], function (err, result, fields) {
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
    anadirNotaModuloTotal(idModulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT alu.id_alumno
        FROM alumno alu
        INNER JOIN curso_alumno ca ON
        ca.id_alumno=alu.id_alumno
        INNER JOIN curso cur ON
        ca.id_curso=cur.id_curso
        INNER JOIN modulo ON
        modulo.id_curso=cur.id_curso            
        WHERE alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso=true
        AND modulo.id_modulo= ?
        AND modulo.estado_modulo=true
        ORDER BY alu.ap_paterno_alumno`;
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var alumnos = yield result(query, [idModulo]);
                const promises = [];
                for (let alumno of alumnos) {
                    promises.push(exports.contenidoModuloPersonalizadoController.anadirNotaModuloPersonalizado(idModulo, alumno.id_alumno));
                }
                const responses = yield Promise.all(promises);
                if (responses.includes(false)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    anadirNotaModuloPersonalizado(idModulo, idAlumno) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE nota_modulo SET nota_modulo = 
        (SELECT SUM(ntc.nota_contenido*cmp.rubrica_contenido/100) AS nota
            FROM nota_contenido ntc
            INNER JOIN contenido_mod_per cmp ON cmp.id_contenido_mod_per = ntc.id_contenido_mod_per
            WHERE ntc.id_alumno = ?
            AND cmp.estado_contenido_mod_per=true
            AND cmp.id_modulo=?
            )
        WHERE id_alumno=?
        AND id_modulo=?`;
                const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                yield result(query, [idAlumno, idModulo, idAlumno, idModulo]);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    modificarNotaContenido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idNotaContenido = req.body.notaContenido.id;
            const notaContenido = req.body.notaContenido.puntuacion;
            console.log(idNotaContenido);
            console.log(notaContenido);
            const sacarDatos = `SELECT cmp.id_modulo ,nct.id_alumno
        FROM contenido_mod_per cmp
        INNER JOIN nota_contenido nct ON cmp.id_contenido_mod_per = nct.id_contenido_mod_per
        WHERE nct.id_nota_contenido=?
        AND cmp.estado_contenido_mod_per=true
        GROUP BY cmp.id_modulo`;
            const query = `UPDATE nota_contenido SET nota_contenido = ? WHERE id_nota_contenido=?`;
            Database_1.default.query(query, [notaContenido, idNotaContenido], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(500).json({ text: 'Error al modificar la nota' });
                    }
                    else {
                        const result = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                        var resIds = yield result(sacarDatos, [idNotaContenido]);
                        yield exports.contenidoModuloPersonalizadoController.anadirNotaModuloPersonalizado(resIds[0].id_modulo, resIds[0].id_alumno);
                        res.status(200).json({ text: 'Nota modificada correctamente' });
                    }
                });
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
            const idDocente = req.docenteId;
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
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        AND nc.id_contenido_mod_per = cmp.id_contenido_mod_per
        WHERE nc.estado_nota_contenido =true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso = true
        AND modu.estado_modulo=1
        AND tm.estado_tipo_modulo = true
        AND cmp.estado_contenido_mod_per=1
        AND cur.id_curso = ?
        AND modu.id_modulo = ?
        AND dc.id_docente = ?
        AND tm.id_tipo_modulo = 2
        AND dc.estado_docente = true
        GROUP BY alu.id_alumno,alu.nombre_alumno,alu.ap_paterno_alumno,alu.ap_materno_alumno`;
            Database_1.default.query(query, [idCurso, idModulo, idDocente], function (err, result, fields) {
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