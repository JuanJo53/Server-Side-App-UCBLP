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
class RecursoAlumnoController {
    obtenerRecursosAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `SELECT seccion.id_seccion,seccion.nombre_seccion
      FROM seccion 
      INNER JOIN curso ON  
      curso.id_curso = seccion.id_curso 
      INNER JOIN curso_alumno ON
      curso_alumno.id_curso=curso.id_curso
      INNER JOIN alumno ON
      alumno.id_alumno=curso_alumno.id_alumno
      WHERE curso.id_curso = ?
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND curso_alumno.estado_curso_alumno=true
      AND alumno.estado_alumno=true
      AND alumno.id_alumno=?`;
            const query2 = `SELECT recurso.nombre_recurso,recurso.ruta_recurso,tipo_recurso.id_tipo_recurso,recurso.id_recurso
      FROM recurso 
      INNER JOIN tipo_recurso ON
      recurso.id_tipo_recurso=tipo_recurso.id_tipo_recurso
      INNER JOIN seccion ON
      recurso.id_seccion = seccion.id_seccion
      INNER JOIN curso ON
      curso.id_curso = seccion.id_curso
      WHERE seccion.id_seccion = ? 
      AND seccion.estado_seccion !=false
      AND curso.estado_curso = true
      AND recurso.estado_recurso !=false 
      AND tipo_recurso.estado_tipo_recurso !=false
      ORDER BY recurso.fecha_subida_recurso ASC`;
            Database_1.default.query(query, [id, req.estudianteId], function (err, result, fields) {
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
                            Database_1.default.query(query2, [sec.id_seccion], function (err2, result2, fields) {
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
    urlFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ubicacion = req.body.file;
            const a = yield Storage_1.default.bucket("archivos-idiomas");
            const url = yield a.file(ubicacion).getSignedUrl({
                action: "read",
                version: "v4",
                expires: Date.now() + 100 * 60 * 60,
            });
            res.json({ url: url });
        });
    }
}
exports.recursoAlumnoController = new RecursoAlumnoController();
//# sourceMappingURL=RecursoAlumnoController.js.map