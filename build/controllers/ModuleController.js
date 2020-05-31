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
class ModuleController {
    agregarModuloPersonalizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombreModulo = req.body.nombreModulo;
            const rubrica = req.body.rubrica;
            const idCurso = req.body.idCurso;
            const idColor = req.body.idColor;
            const idImagen = req.body.idImagen;
            const query = `insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,modulo_habilitado,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        (?,?,?,?,true,true,2,?,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()) `;
            Database_1.default.query(query, [nombreModulo, rubrica, idCurso, idColor, idImagen], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al crear el módulo' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Módulo creado correctamente' });
                }
            });
        });
    }
    listarModulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.imagen,color.valor ,modulo.id_tipo_modulo FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        WHERE curso.id_curso = ?
        AND modulo.estado_modulo = true`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los módulos personalizados' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    listarModulosPredeterminados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.imagen,color.valor FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        WHERE curso.id_curso = ?
        AND modulo.estado_modulo = true
        AND modulo.id_tipo_modulo = 1`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los módulos personalizados' });
                    throw err;
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    editarModuloPersonalizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const nombreModulo = req.body.nombreModulo;
            const rubrica = req.body.rubrica;
            const idColor = req.body.idColor;
            const idImagen = req.body.idColor;
            const query = `UPDATE modulo SET nombre_modulo = ?, rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
            Database_1.default.query(query, [nombreModulo, rubrica, idColor, idImagen, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al actualizar el módulo' });
                    throw err;
                }
                else {
                    res.status(500).json({ text: 'Módulo actualizado' });
                }
            });
        });
    }
    editarModuloPredeterminado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rubrica = req.body.rubrica;
            const idColor = req.body.idColor;
            const idImagen = req.body.idColor;
            const query = `UPDATE modulo SET  rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
            Database_1.default.query(query, [rubrica, idColor, idImagen, id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al actualizar el módulo' });
                    throw err;
                }
                else {
                    res.status(500).json({ text: 'Módulo actualizado' });
                }
            });
        });
    }
    desactivarModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE modulo SET  modulo_habilitado = false  WHERE id_modulo = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al desactivar el módulo' });
                    throw err;
                }
                else {
                    res.status(500).json({ text: 'Módulo desactivado' });
                }
            });
        });
    }
    activarModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE modulo SET  modulo_habilitado = true  WHERE id_modulo = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al activar el módulo' });
                    throw err;
                }
                else {
                    res.status(500).json({ text: 'Módulo activado' });
                }
            });
        });
    }
    eliminarModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE modulo SET  modulo_habilitado = false, estado_modulo=false  WHERE id_modulo = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al actualizar el módulo' });
                    throw err;
                }
                else {
                    res.status(500).json({ text: 'Módulo actualizado' });
                }
            });
        });
    }
}
exports.moduleController = new ModuleController();
//# sourceMappingURL=ModuleController.js.map