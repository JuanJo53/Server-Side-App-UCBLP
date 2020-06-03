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
class LessonController {
    agregarLeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.idTema;
            const numeroLeccion = req.body.numeroLeccion;
            const nombreLeccion = req.body.nombre;
            const idTipoLeccion = req.body.idTipoLeccion;
            const idImagen = req.body.idImagen;
            const query = `INSERT INTO leccion 
        (id_tema,numero_leccion,nombre_leccion,estado_leccion,id_tipo_leccion,id_imagen,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [id, numeroLeccion, nombreLeccion, idTipoLeccion, idImagen], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'Error al crear nueva lección' });
                }
                else {
                    res.status(200).json({ text: 'Lección creada correctamente' });
                }
            });
        });
    }
    editarLeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const numeroLeccion = req.body.numeroLeccion;
            const nombreLeccion = req.body.nombre;
            const idTipoLeccion = req.body.idTipoLeccion;
            const idImagen = req.body.idImagen;
            const estado = req.body.estado;
            const query = `UPDATE leccion SET numero_leccion=?, nombre_leccion=?, estado_leccion = ?,id_imagen=?,id_tipo_leccion=? WHERE id_leccion= ?`;
            Database_1.default.query(query, [numeroLeccion, nombreLeccion, estado, idImagen, idTipoLeccion, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al actualizar lección lección' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Lección actualizada correctamente' });
                }
            });
        });
    }
    eliminarLeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE leccion SET estado_leccion = false WHERE id_leccion= ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo eliminar la lección' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Lección eliminada correctamente' });
                }
            });
        });
    }
    listarTipoLeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT tipo_leccion.id_tipo_leccion,tipo_leccion.tipo_leccion
                        FROM tipo_leccion
                        WHERE tipo_leccion.estado_tipo_leccion`;
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar las lecciones' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    listarLecciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT leccion.estado_leccion,leccion.id_leccion, leccion.numero_leccion, leccion.nombre_leccion,tipo_leccion.id_tipo_leccion,leccion.id_imagen
                        FROM leccion INNER JOIN tema ON
                        leccion.id_tema=tema.id_tema
                        INNER JOIN tipo_leccion ON
                        tipo_leccion.id_tipo_leccion = leccion.id_tipo_leccion
                        WHERE tema.id_tema = ? AND
                        estado_leccion != false`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar las lecciones' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.lessonController = new LessonController();
//# sourceMappingURL=LessonController.js.map