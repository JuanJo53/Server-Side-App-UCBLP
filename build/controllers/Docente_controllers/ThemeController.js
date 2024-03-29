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
class ThemeController {
    agregarTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const numeroTema = req.body.numeroTema;
            const nombreTema = req.body.nombreTema;
            const idImagen = req.body.idImagen;
            const idCurso = req.body.idCurso;
            const query = `INSERT INTO tema (numero_tema,nombre_tema,id_curso,estado_tema,id_imagen,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP()) `;
            Database_1.default.query(query, [numeroTema, nombreTema, idCurso, idImagen], function (err, result, fields) {
                if (err) {
                    res.status(501).json({ text: 'No se pudo crear el tema' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Tema creado exitosamente' });
                }
            });
        });
    }
    listarTemas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            const query = `SELECT tema.id_tema,tema.numero_tema,tema.nombre_tema,tema.id_imagen,tema.estado_tema 
        FROM tema 
        INNER JOIN curso ON
        curso.id_curso=tema.id_curso 
        INNER JOIN docente ON
        curso.id_docente = docente.id_docente
        WHERE curso.id_curso = ? 
        AND docente.id_docente = ?
        AND (tema.estado_tema=true OR tema.estado_tema=2)
        AND curso.estado_curso = true
        AND docente.estado_docente = true
        ORDER BY tema.numero_tema ASC`;
            Database_1.default.query(query, [id, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo cargar la lista de temas' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    actualizarTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const id = req.body.idTema;
            const numeroTema = req.body.numeroTema;
            const nombreTema = req.body.nombreTema;
            const estadoTema = req.body.estado;
            const idImagen = req.body.idImagen;
            const query = `UPDATE tema SET numero_tema=?, nombre_tema=?, id_imagen=?,estado_tema=? WHERE id_tema= ?`;
            Database_1.default.query(query, [numeroTema, nombreTema, idImagen, estadoTema, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo actualizar tema' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Tema actualizado correctamente' });
                }
            });
        });
    }
    eliminarTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE tema SET estado_tema = false WHERE id_tema= ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo eliminar tema' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Tema eliminado correctamente' });
                }
            });
        });
    }
}
exports.themeController = new ThemeController();
//# sourceMappingURL=ThemeController.js.map