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
class DashBoardController {
    dashPracticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idDocente = req.docenteId;
            const query = `SELECT COUNT(IF(np.nota_practica >=51 AND np.practica_dada=1,1,null)) aprobados,COUNT(IF(np.nota_practica <51  AND np.practica_dada=1,1,null)) reprobados,COUNT(IF(np.practica_dada!=1,1,null)) sin_dar,pr.id_practica,pr.nombre_practica
        FROM nota_practica np
        JOIN practica pr ON
        np.id_practica=pr.id_practica
        JOIN leccion lcc ON
        lcc.id_leccion=pr.id_leccion
        JOIN tema tm ON 
        tm.id_tema = lcc.id_tema
        JOIN curso cr ON
        cr.id_curso = tm.id_curso
        JOIN docente dc ON
        dc.id_docente = cr.id_docente
        and cr.id_docente = dc.id_docente
        WHERE np.estado_nota_practica=true
        AND lcc.estado_leccion = true
        AND pr.estado_practica = true
        AND tm.estado_tema = true
        AND cr.estado_curso = true
        AND dc.estado_docente = true
        AND cr.id_curso = ?
        AND dc.id_docente = ?
        group by pr.id_practica
        order by pr.fin_fecha desc`;
            Database_1.default.query(query, [id, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar el promedio de prácticas' });
                }
                else {
                    //codigo para hacerlo por porcentaje
                    // for(let practica of result){
                    //     var total=Number(practica.aprobados)+Number(practica.reprobados);
                    //     practica.aprobados=100/total*practica.aprobados;
                    //     practica.reprobados=100/total*practica.reprobados;
                    // }
                    res.status(200).json(result);
                }
            });
        });
    }
    promedioExamenes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idDocente = req.docenteId;
            const query = `
        SELECT ext.id_examen,AVG(ent.nota_examen)
        FROM nota_examen ent 
        JOIN examen_tema ext ON
        ent.id_examen = ext.id_examen
        JOIN tema tm ON
        tm.id_tema = ext.id_tema
        JOIN curso cur ON
        cur.id_curso = tm.id_curso 
        JOIN curso_alumno ca ON 
        ca.id_curso = cur.id_curso
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        where ent.estado_nota_examen = true
        AND ext.estado_examen = true
        AND tm.estado_tema=true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno =true
        AND cur.id_curso = ?
        AND dc.id_docente = ?
        GROUP BY ent.id_examen;`;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar el promedio de examenes' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    promedioPracticasPorTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idDocente = req.docenteId;
            const query = `SELECT DISTINCT tm.numero_tema as 'numeroTema' ,AVG(np.nota_practica) as 'promedioPracticas'
        FROM nota_practica np 
        JOIN practica pr ON
        pr.id_practica = np.id_practica
        JOIN leccion lcc ON
        pr.id_leccion = lcc.id_leccion
        JOIN tema tm ON
        tm.id_tema = lcc.id_tema
        JOIN curso cur ON
        cur.id_curso = tm.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = ca.id_curso
        JOIN docente dc ON
        cur.id_docente = dc.id_docente
        WHERE np.estado_nota_practica=true
        AND lcc.estado_leccion = 2 OR lcc.estado_leccion = 1
        AND pr.estado_practica = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND dc.estado_docente = true
        AND cur.id_curso = ?
        AND dc.id_docente =?
        GROUP by tm.id_tema;`;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar los promedios de prácticas' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    notasPracticasPorTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idDocente = req.docenteId;
            const query = `SELECT tm.id_tema, tm.numero_tema,lcc.id_leccion , pr.id_practica,np.nota_practica
        FROM nota_practica np 
        JOIN practica pr ON
        pr.id_practica = np.id_practica
        JOIN leccion lcc ON
        pr.id_leccion = lcc.id_leccion
        JOIN tema tm ON
        tm.id_tema = lcc.id_tema
        JOIN curso cur ON
        cur.id_curso = tm.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = ca.id_curso
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        WHERE np.estado_nota_practica=true
        AND lcc.estado_leccion = 2 OR lcc.estado_leccion = 1
        AND pr.estado_practica = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = 1
        AND dc.id_docente= 14
        AND dc.estado_docente = true
        GROUP BY tm.id_tema, tm.numero_tema,lcc.id_leccion , pr.id_practica,np.nota_practica;`;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar las notas prácticas' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    promedioExamenesPorTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idDocente = req.docenteId;
            const idCurso = req.body.idCurso;
            const query = `select DISTINCT  tm.numero_tema, AVG(ne.nota_examen)
        FROM nota_examen ne 
        JOIN examen_tema et ON
        ne.id_examen=et.id_examen
        JOIN tema tm ON
        tm.id_tema = et.id_tema
        JOIN curso cur ON
        cur.id_curso = tm.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = cur.id_curso
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        WHERE ne.estado_nota_examen = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND dc.estado_docente = true
        AND cur.id_curso = ?
        AND dc.id_docente = ?
        GROUP BY tm.id_tema;`;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar el promedio de exámenes' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    notasExamenesPorTema(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idDocente = req.docenteId;
            const query = `SELECT et.id_examen, ne.nota_examen
        FROM nota_examen ne 
        JOIN examen_tema et ON
        ne.id_examen=et.id_examen
        JOIN tema tm ON
        tm.id_tema = et.id_tema
        JOIN curso cur ON
        cur.id_curso = tm.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = cur.id_curso
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        WHERE ne.estado_nota_examen = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND dc.estado_docente = true
        AND cur.id_curso = ?
        AND dc.id_docente = ?
        GROUP BY et.id_examen,tm.id_tema,ne.nota_examen;
        `;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar las notas de exámenes' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    asistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idDocente = req.docenteId;
            const query = `select count(DISTINCT asn.id_clase_alumno) as asistencias
        FROM asistencia asn
        JOIN clase cls ON
        cls.id_clase = asn.id_clase
        JOIN curso cur ON
        cur.id_curso = cls.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = cur.id_curso
        JOIN alumno alu ON
        alu.id_alumno = ca.id_alumno
        JOIN docente dc ON
        dc.id_docente =cur.id_docente
        WHERE asn.asistencia = true
        AND  asn.estado_asistencia = true
        AND cls.estado_clase = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND dc.estado_docente = true
        AND cur.id_curso = ?
        AND dc.id_docente = ?
        AND cls.fecha_clase BETWEEN '2020-02-01' AND '2020-02-29';`;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar las asistencias' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    faltas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCurso = req.body.idCurso;
            const idDocente = req.docenteId;
            const query = `select count(DISTINCT asn.id_clase_alumno) as faltas
        FROM asistencia asn
        JOIN clase cls ON
        cls.id_clase = asn.id_clase
        JOIN curso cur ON
        cur.id_curso = cls.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = cur.id_curso
        JOIN alumno alu ON
        alu.id_alumno = ca.id_alumno
        JOIN docente dc ON
        dc.id_docente = cur.id_docente
        WHERE asn.asistencia = false
        AND  asn.estado_asistencia = true
        AND cls.estado_clase = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = ?
        AND dc.id_docente = ?
        AND cls.fecha_clase BETWEEN '2020-02-01' AND '2020-02-29';`;
            Database_1.default.query(query, [idCurso, idDocente], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error al cargar las faltas' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
}
exports.dashBoardController = new DashBoardController();
//# sourceMappingURL=DashBoardController.js.map