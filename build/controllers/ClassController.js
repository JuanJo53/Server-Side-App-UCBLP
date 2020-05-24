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
class ClassController {
    listaAlumnos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `select curso_alumno.id_curso_alumno ,alumno.id_alumno, alumno.nombre_alumno, alumno.ap_paterno_alumno,alumno.ap_materno_alumno, sum(nota_modulo.nota_modulo*modulo.rubrica/100) as 'nota'
        from curso_alumno inner join alumno on 
        curso_alumno.id_alumno = alumno.id_alumno
        inner join nota_modulo on
        alumno.id_alumno=nota_modulo.id_alumno
        inner join modulo on 
        nota_modulo.id_modulo=modulo.id_modulo
        inner join curso on
        curso.id_curso=modulo.id_curso
        where curso_alumno.id_curso=?
        and curso.estado_curso = true 
        and alumno.estado_alumno=true
        and modulo.estado_modulo=true
        and curso_alumno.estado_curso_alumno=true
        group by curso_alumno.id_alumno , curso_alumno.id_curso_alumno
        order by alumno.ap_paterno_alumno;`;
            yield Database_1.default.query(query, [id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    bajaAlumnoCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const query = `UPDATE curso_alumno SET estado_curso_alumno = false WHERE id_curso_alumno= ?`;
            Database_1.default.query(query, [id], function (err, result, fields) {
                if (err) {
                    res.json({ text: 'Error en la eliminación' }).status(403);
                    throw err;
                }
                else {
                    res.json({ text: 'El alumno ha sido eliminado con éxito' }).status(200);
                }
            });
        });
    }
    obtenerAlumnoAltaCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const correoAlumno = req.body.correoAlumno;
            const query = `SELECT id_alumno,nombre_alumno,ap_paterno_alumno,ap_materno_alumno FROM alumno WHERE correo_alumno = ? AND estado_alumno = true`;
            Database_1.default.query(query, [correoAlumno], function (err, result, fields) {
                if (err) {
                    res.status(403).json({ text: 'Error' });
                    throw err;
                }
                else {
                    if (result.length > 0) {
                        res.status(200).json(result);
                    }
                    else {
                        res.statusMessage = "student not found";
                        res.status(210).json({ text: 'Alumno no encontrado' });
                    }
                }
            });
        });
    }
    altaAlumnoCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlunmo = req.body.idAlunmo;
            const idCurso = req.body.idCurso;
            console.log(idAlunmo);
            console.log(idCurso);
            const query = `INSERT INTO curso_alumno (id_alumno,id_curso,estado_curso_alumno,tx_id,tx_username,tx_host,tx_date)
                      VALUES (?,?,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP())`;
            Database_1.default.query(query, [idAlunmo, idCurso], function (err, result, fields) {
                if (err) {
                    res.statusMessage = "sql err";
                    res.status(211).json({ text: 'No se pudo agregar al estudiante' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'El alumno ha sido agregado con éxito' });
                }
            });
        });
    }
}
exports.classController = new ClassController();
//# sourceMappingURL=ClassController.js.map