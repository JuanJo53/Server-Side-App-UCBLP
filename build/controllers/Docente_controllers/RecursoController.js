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
const Storage_1 = __importDefault(require("../../Storage"));
class RecursoController {
    generateId() {
        // Alphanumeric characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i = 0; i < 20; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }
    crearImaasdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var filename = './src/archivos/asdf.jpg';
            const bucketName = 'bucket-name';
            const a = yield Storage_1.default.bucket("archivos-idiomas");
            const nombre = exports.recursoController.generateId();
            var date = String(Date.now());
            a.upload(filename, { destination: "audio/" + nombre + date }).then((val) => {
                console.log(val);
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    urlFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ubicacion = req.body.file;
            const a = yield Storage_1.default.bucket("archivos-idiomas");
            const nombre = exports.recursoController.generateId();
            var date = String(Date.now());
            const url = yield a.file(ubicacion).getSignedUrl({
                action: "read",
                version: "v4",
                expires: Date.now() + 100 * 60 * 60,
            });
            res.json({ url: url });
        });
    }
    subirDoc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = yield Storage_1.default.bucket("archivos-idiomas");
            const nombre = exports.recursoController.generateId();
            var date = String(Date.now());
            const url = yield a.file("doc/" + nombre + date).getSignedUrl({
                action: "write",
                version: "v4",
                expires: Date.now() + 100 * 60 * 60,
            });
            console.log(url);
            res.json({ url: url, ruta: "doc/" + nombre + date });
        });
    }
    subirAudio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var filename = './src/archivos/asdf.jpg';
            const bucketName = 'bucket-name';
            const a = yield Storage_1.default.bucket("archivos-idiomas");
            const nombre = exports.recursoController.generateId();
            var date = String(Date.now());
            const url = yield a.file("audio/" + nombre + date).getSignedUrl({
                action: "write",
                version: "v4",
                expires: Date.now() + 100 * 60 * 60,
            });
            console.log(url);
            res.json({ url: url, ruta: "audio/" + nombre + date });
        });
    }
    subirVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var filename = './src/archivos/asdf.jpg';
            const bucketName = 'bucket-name';
            const a = yield Storage_1.default.bucket("archivos-idiomas");
            const nombre = exports.recursoController.generateId();
            var date = String(Date.now());
            const url = yield a.file("video/" + nombre + date).getSignedUrl({
                action: "write",
                version: "v4",
                expires: Date.now() + 100 * 60 * 60,
            });
            console.log(url);
            res.json({ url: url, ruta: "video/" + nombre + date });
        });
    }
    agregarSeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.id;
            const nombreSeccion = req.body.nombre;
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
            const idSeccion = req.body.id;
            const nombreRecurso = req.body.resource.nombre;
            const rutaRecurso = req.body.resource.url;
            const idTipoRecurso = req.body.resource.tipo;
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
    listarSecciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            const query = `SELECT seccion.id_seccion,seccion.nombre_seccion
      FROM seccion 
      JOIN curso ON  
      curso.id_curso = seccion.id_curso 
      JOIN docente ON
      docente.id_docente = curso.id_docente
      WHERE curso.id_curso = ?
      AND docente.id_docente = ?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND docente.estado_docente = true`;
            const query2 = `SELECT recurso.nombre_recurso,recurso.ruta_recurso,tipo_recurso.id_tipo_recurso,recurso.id_recurso
      FROM recurso 
      INNER JOIN tipo_recurso ON
      recurso.id_tipo_recurso=tipo_recurso.id_tipo_recurso
      INNER JOIN seccion ON
      recurso.id_seccion = seccion.id_seccion
      INNER JOIN curso ON
      curso.id_curso = seccion.id_curso
      INNER JOIN docente ON
      docente.id_docente = curso.id_docente
      WHERE seccion.id_seccion = ? 
      AND docente.id_docente =?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND docente.estado_docente = true
      AND recurso.estado_recurso !=false 
      AND tipo_recurso.estado_tipo_recurso !=false`;
            Database_1.default.query(query, [id, idDocente], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ text: 'No se pudo listar los recursos' });
                    }
                    else {
                        var c = result.length;
                        if (c == 0) {
                            res.status(200).json(result);
                        }
                        for (let sec of result) {
                            Database_1.default.query(query2, [sec.id_seccion, idDocente], function (err2, result2, fields) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (err2) {
                                        console.log(err2);
                                        res.status(500).json({ text: 'No se pudo listar los recursos' });
                                    }
                                    else {
                                        sec.recursos = result2;
                                        c--;
                                        if (c == 0) {
                                            res.status(200).json(result);
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
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
                    console.log(err);
                    res.status(500).json({ text: 'No se pudo listar los recursos' });
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
                    const query2 = `UPDATE recurso SET estado_recurso = false WHERE id_seccion = ?`;
                    Database_1.default.query(query2, [id], function (err2, result2, fields) {
                        if (err2) {
                            console.log(err2);
                            res.status(500).json({ text: 'No se pudo eliminar la sección' });
                        }
                        else {
                            res.status(200).json({ text: 'Sección eliminada' });
                        }
                    });
                }
            });
        });
    }
    modificarSeccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const nombreSeccion = req.body.nombre;
            console.log(req.body);
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
            const id = req.body.resource.id;
            const nombreRecurso = req.body.resource.nombre;
            const query = `UPDATE recurso SET nombre_recurso = ? WHERE id_recurso = ?`;
            Database_1.default.query(query, [nombreRecurso, id], function (err, result, fields) {
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