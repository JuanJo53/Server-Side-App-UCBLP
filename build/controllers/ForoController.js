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
class ForoController {
    crearForo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const nombreForo = req.body.nombreForo;
            const descripcionForo = req.body.descripcionForo;
            const query = `INSERT INTO foro (id_curso,nombre_foro,descripcion_foro,fecha_creacion,estado_foro,tx_id,tx_username,tx_host,tx_date) 
        VALUES (?,?,?,CURRENT_TIMESTAMP(),TRUE,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [idCurso, nombreForo, descripcionForo], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo crear el foro' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Foro creado con éxito' });
                }
            });
        });
    }
    listarForos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT foro.id_foro, foro.nombre_foro, foro.descripcion_foro, foro.fecha_creacion
                      FROM foro INNER JOIN curso ON
                      foro.id_curso=curso.id_curso
                      WHERE curso.id_curso = ?
                      AND foro.estado_foro=true`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al listar los foros' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    modificarForos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const nombreForo = req.body.nombreForo;
            const descripcionForo = req.body.descripcionForo;
            const query = `UPDATE foro SET nombre_foro = ?, descripcion_foro= ? WHERE id_foro = ?`;
            Database_1.default.query(query, [nombreForo, descripcionForo, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al modificar el foro' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Foro modificado' });
                }
            });
        });
    }
    eliminarForo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE foro SET estado_foro=false WHERE id_foro=?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al eliminar el foro' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Foro eliminado con éxito' });
                }
            });
        });
    }
}
exports.foroController = new ForoController();
//# sourceMappingURL=ForoController.js.map