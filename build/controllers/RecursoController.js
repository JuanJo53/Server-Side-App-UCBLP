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
class RecursoController {
    agregarSeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const nombreSeccion = req.body.nombreSeccion;
            const query = `INSERT INTO seccion (id_curso,nombre_seccion,estado_seccion,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [idCurso, nombreSeccion], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo crear la sección' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Sección creada correctamente' });
                }
            });
        });
    }
    agregarRecurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idSeccion = req.body.idSeccion;
            const nombreRecurso = req.body.nombreRecurso;
            const rutaRecurso = req.body.rutaRecurso;
            const idTipoRecurso = req.body.idTipoRecurso;
            const query = `INSERT INTO recurso (id_seccion,nombre_recurso,ruta_recurso,id_tipo_recurso,estado_recurso,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [idSeccion, nombreRecurso, rutaRecurso, idTipoRecurso], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo subir el recurso' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Recurso agregado correctamente' });
                }
            });
        });
    }
    listarRecursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT seccion.id_seccion,seccion.nombre_seccion,recurso.id_recurso,recurso.nombre_recurso,tipo_recurso.tipo_recurso
        FROM tipo_recurso INNER JOIN recurso ON
        tipo_recurso.id_tipo_recurso = recurso.id_tipo_recurso
        INNER JOIN seccion ON 
        seccion.id_seccion= recurso.id_seccion
        INNER JOIN curso ON
        curso.id_curso = seccion.id_curso
        WHERE curso.id_curso = ?
        AND seccion.estado_seccion = true
        AND recurso.estado_recurso=true
        group by recurso.id_seccion,recurso.id_recurso;`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los recursos' });
                    throw err;
                }
                else {
                    res.status(200).json({ result });
                }
            });
        });
    }
    eliminarRecurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE recurso SET estado_recurso = false WHERE id_recurso = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo eliminar el recurso' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Recurso eliminado' });
                }
            });
        });
    }
    eliminarSeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE seccion SET estado_seccion = false WHERE id_seccion = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo eliminar la sección' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Sección eliminada' });
                }
            });
        });
    }
    modificarSeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const nombreSeccion = req.body.nombreSeccion;
            const query = `UPDATE seccion SET nombre_seccion = ? WHERE id_seccion = ?`;
            Database_1.default.query(query, [nombreSeccion, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo actualizar la sección' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Sección actualizada correctamente' });
                }
            });
        });
    }
    modificarRecurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const nombreRecurso = req.body.nombreRecurso;
            const rutaRecurso = req.body.rutaRecurso;
            const idTipoRecurso = req.body.idTipoRecurso;
            const query = `UPDATE recurso SET nombre_recurso = ?,ruta_recurso=?,id_tipo_recurso=? WHERE id_recurso = ?`;
            Database_1.default.query(query, [nombreRecurso, rutaRecurso, idTipoRecurso, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo actualizar el recurso' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Recurso actualizado correctamente' });
                }
            });
        });
    }
}
exports.recursoController = new RecursoController();
//# sourceMappingURL=RecursoController.js.map