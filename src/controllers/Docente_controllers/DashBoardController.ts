import { Request, Response } from 'express';
import Db from '../Database';

class DashBoardController {
    public async promedioPracticas(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
        const query = `SELECT pr.id_practica ,pr.numero_practica,AVG (np.nota_practica)
        FROM nota_practica np
        JOIN practica pr ON
        np.id_practica=pr.id_practica
        JOIN leccion lcc ON
        lcc.id_leccion=pr.id_leccion
        JOIN tema tm ON 
        tm.id_tema = lcc.id_tema
        JOIN curso cr ON
        cr.id_curso = tm.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso = cr.id_curso
        WHERE np.estado_nota_practica=true
        AND lcc.estado_leccion = 2 OR lcc.estado_leccion = 1
        AND pr.estado_practica = true
        AND tm.estado_tema = true
        AND cr.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cr.id_curso = ?
        GROUP by np.id_practica;`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar el promedio de prácticas' });
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async promedioExamenes(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
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
        where ent.estado_nota_examen = true
        AND ext.estado_examen = true
        AND tm.estado_tema=true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno =true
        AND cur.id_curso = ?
        GROUP BY ent.id_examen;`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar el promedio de examenes'});
            }
            else {
                res.status(200).json(result);
            }
        });

    }

    public async promedioPracticasPorTema(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
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
        WHERE np.estado_nota_practica=true
        AND lcc.estado_leccion = 2 OR lcc.estado_leccion = 1
        AND pr.estado_practica = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = ?
        GROUP by tm.id_tema;`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar los promedios de prácticas'});
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async notasPracticasPorTema(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
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
        WHERE np.estado_nota_practica=true
        AND lcc.estado_leccion = 2 OR lcc.estado_leccion = 1
        AND pr.estado_practica = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = ?
        GROUP BY tm.id_tema, tm.numero_tema,lcc.id_leccion , pr.id_practica,np.nota_practica;`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar las notas prácticas' });
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async promedioExamenesPorTema(req: Request, res: Response) {
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
        WHERE ne.estado_nota_examen = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = ?
        GROUP BY tm.id_tema;`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar el promedio de exámenes'});
            }
            else {
                res.status(200).json(result);
            }
        });

    }

    public async notasExamenesPorTema(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
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
        WHERE ne.estado_nota_examen = true
        AND tm.estado_tema = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = 1
        GROUP BY et.id_examen,tm.id_tema,ne.nota_examen;
        `;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar las notas de exámenes'});
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async asistencia(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
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
        WHERE asn.asistencia = true
        AND  asn.estado_asistencia = true
        AND cls.estado_clase = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = ?
        AND cls.fecha_clase BETWEEN '2020-02-01' AND '2020-02-29';`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar las asistencias'});
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async faltas(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
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
        WHERE asn.asistencia = false
        AND  asn.estado_asistencia = true
        AND cls.estado_clase = true
        AND cur.estado_curso = true
        AND ca.estado_curso_alumno = true
        AND cur.id_curso = ?
        AND cls.fecha_clase BETWEEN '2020-02-01' AND '2020-02-29';`;
        Db.query(query, [idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar las faltas'});
            }
            else {
                res.status(200).json(result);
            }
        });

    }



}

export const dashBoardController = new DashBoardController();