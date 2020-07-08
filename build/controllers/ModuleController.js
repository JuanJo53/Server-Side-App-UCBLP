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
    listarColores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT color.id_color,color.valor
                        FROM color
                        WHERE color.estado_color=true`;
            Database_1.default.query(query, function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los colores' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    agregarModuloPersonalizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombreModulo = req.body.nombreModulo;
            const rubrica = req.body.rubrica;
            const idCurso = req.body.idCurso;
            const idColor = req.body.idColor;
            const idImagen = req.body.idImagen;
            console.log(req.body);
            const query = `insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        (?,?,?,?,true,2,?,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()) `;
            Database_1.default.query(query, [nombreModulo, rubrica, idCurso, idColor, idImagen], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'Error al crear el módulo' });
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
            const query = `SELECT modulo.id_modulo,modulo.nombre_modulo, modulo.rubrica, imagen.id_imagen,color.id_color ,modulo.id_tipo_modulo, modulo.estado_modulo FROM 
        modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        INNER JOIN color ON
        modulo.id_color= color.id_color
        INNER JOIN imagen ON 
        imagen.id_imagen=modulo.id_imagen
        WHERE curso.id_curso = ?
        AND modulo.estado_modulo !=0`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los módulos personalizados' });
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
        AND modulo.estado_modulo = 1
        AND modulo.id_tipo_modulo = 1
        AND color.estado_color=true
        AND imagen.estado_imagen=true
        AND curso.estado_curso=true`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'No se pudo listar los módulos predeterminados' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    listarModulosPersonalizados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT modu.id_modulo,modu.nombre_modulo, modu.rubrica 
        FROM modulo modu 
        JOIN curso cur 
        ON cur.id_curso =modu.id_curso
        JOIN tipo_modulo tm ON
        modu.id_tipo_modulo = tm.id_tipo_modulo
        WHERE tm.id_tipo_modulo = 2
        AND cur.id_curso = ?
        AND modu.estado_modulo = true
        AND cur.estado_curso=true
        AND tm.estado_tipo_modulo = true
      `;
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
    actualizarRubricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const rubricas = req.body.rubricas;
            const query = `UPDATE modulo SET rubrica = ? WHERE id_modulo = ?`;
            var tam = rubricas.length;
            if (tam > 0) {
                for (let rubrica of rubricas) {
                    Database_1.default.query(query, [rubrica.rubrica, rubrica.id_modulo], function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ text: 'Error al actualizar el módulo' });
                        }
                        else {
                            tam--;
                            if (tam == 0) {
                                res.status(200).json({ text: 'Módulo actualizado' });
                            }
                        }
                    });
                }
            }
            else {
                res.status(200).json({ text: 'Módulo actualizado' });
            }
        });
    }
    editarModuloPersonalizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const id = req.body.id;
            const nombreModulo = req.body.nombreModulo;
            const rubrica = req.body.rubrica;
            const idColor = req.body.idColor;
            const idImagen = req.body.idImagen;
            const estado = req.body.estado;
            const query = `UPDATE modulo SET estado_modulo=?,nombre_modulo = ?, rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
            Database_1.default.query(query, [estado, nombreModulo, rubrica, idColor, idImagen, id], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'Error al actualizar el módulo' });
                }
                else {
                    res.status(200).json({ text: 'Módulo actualizado' });
                }
            });
        });
    }
    editarModuloPredeterminado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const rubrica = req.body.rubrica;
            const idColor = req.body.idColor;
            const idImagen = req.body.idImagen;
            const estado = req.body.estado;
            const query = `UPDATE modulo SET  estado_modulo = ?, rubrica = ?, id_color=?, id_imagen =? WHERE id_modulo = ?`;
            Database_1.default.query(query, [estado, rubrica, idColor, idImagen, id], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'Error al actualizar el módulo' });
                }
                else {
                    res.status(200).json({ text: 'Módulo actualizado' });
                }
            });
        });
    }
    desactivarModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE modulo SET  estado_modulo = 2  WHERE id_modulo = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al desactivar el módulo' });
                }
                else {
                    res.status(200).json({ text: 'Módulo desactivado' });
                }
            });
        });
    }
    activarModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE modulo SET  estado_modulo = 1  WHERE id_modulo = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al activar el módulo' });
                }
                else {
                    res.status(200).json({ text: 'Módulo activado' });
                }
            });
        });
    }
    eliminarModulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE modulo SET   estado_modulo=0  WHERE id_modulo = ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al actualizar el módulo' });
                }
                else {
                    res.status(200).json({ text: 'Módulo actualizado' });
                }
            });
        });
    }
}
exports.moduleController = new ModuleController();
//# sourceMappingURL=ModuleController.js.map