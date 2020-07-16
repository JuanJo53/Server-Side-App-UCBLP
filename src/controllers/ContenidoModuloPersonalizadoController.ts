import { Request, Response } from 'express';
import Db from '../Database';

class ContenidoModuloPersonalizadoController {


    public async agregarContenido(req: Request, res: Response) {
        const idModulo = req.body.idModulo;
        const numeroContenido = req.body.numeroContenido;
        const nombreContenido = req.body.nombreContenido;
        const query = `INSERT INTO contenido_mod_per (id_modulo,numero_contenido,nombre_contenido,estado_contenido_mod_per,tx_id,tx_username,tx_host)
        VALUES (?,?,?,1,1,'root','192.168.0.10')`;
        Db.query(query,[idModulo,numeroContenido,nombreContenido], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al agregar contenido' });
            }
            else {
                res.status(200).json({ text: 'Contenido agregado correctamente' });
            }
        });

    }

    public async desactivarContenido(req: Request, res: Response) {
        const idContenidoModPer = req.body.idContenidoModPer;
        const query = `UPDATE contenido_mod_per SET estado_contenido_mod_per = 2 WHERE id_contenido_mod_per =? `;
        Db.query(query,[idContenidoModPer], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al desactivar contenido'});
            }
            else {
                res.status(200).json({text: 'Contenido desactivado correctamente'});
            }
        });

    }
    public async eliminarContenido(req: Request, res: Response) {
        const idContenidoModPer = req.body.idContenidoModPer;
        const query = `UPDATE contenido_mod_per SET estado_contenido_mod_per = 0 WHERE id_contenido_mod_per =? `;
        Db.query(query,[idContenidoModPer], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al eliminar contenido'});
            }
            else {
                res.status(200).json({text: 'Contenido eliminado correctamente'});
            }
        });

    }
    public async modificarContenido(req: Request, res: Response) {
        const idContenidoModPer = req.body.idContenidoModPer;
        const numeroContenido = req.body.numeroContenido;
        const nombreContenido = req.body.nombreContenido;
        const query = `UPDATE contenido_mod_per SET nombre_contenido = ? , numero_contenido = ? WHERE id_contenido_mod_per =? `;
        Db.query(query,[idContenidoModPer,nombreContenido,numeroContenido], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al eliminar contenido'});
            }
            else {
                res.status(200).json({text: 'Contenido eliminado correctamente'});
            }
        });

    }
    public async listarContenido(req: Request, res: Response) {
        const idCurso = req.body.idCurso;
        const query = `SELECT cont.id_contenido_mod_per, cont.numero_contenido,cont.nombre_contenido
        FROM contenido_mod_per cont
        JOIN modulo modu ON
        cont.id_modulo=modu.id_modulo
        JOIN curso cur ON
        cur.id_curso = modu.id_curso
        WHERE cur.estado_curso=true
        AND modu.estado_modulo=1 OR modu.estado_modulo=2
        AND cont.estado_contenido_mod_per=1 OR cont.estado_contenido_mod_per=2
        AND cur.id_curso = 1`;
        Db.query(query,[idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al eliminar contenido'});
            }
            else {
                res.status(200).json({text: 'Contenido eliminado correctamente'});
            }
        });
    }
    public async agregarNotaAContenido(req: Request, res: Response) {
        const idContenidoModPer = req.body.idContenidoModPer;
        const idAlumno = req.body.idAlumno;
        const notaContenido= req.body.notaContenido;
        const query = `INSERT INTO nota_contenido (id_contenido_mod_per,id_alumno,nota_contenido,tx_id,tx_username,tx_host)
        VALUES (?,?,?,1,'root','192.168.0.10')`;
        Db.query(query,[idContenidoModPer,idAlumno,notaContenido], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al agregar la nota'});
            }
            else {
                res.status(200).json({text: 'Nota agregada correctamente'});
            }
        });
    }
    public async modificarNotaContenido(req: Request, res: Response) {
        const idNotaContenido = req.body.idNotaContenido;
        const notaContenido= req.body.notaContenido;
        const query = `UPDATE nota_contenido SET nota_contenido = ? WHERE id_nota_contenido=?`;
        Db.query(query,[idNotaContenido,notaContenido], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al modificar la nota'});
            }
            else {
                res.status(200).json({text: 'Nota modificada correctamente'});
            }
        });
    }
    public async eliminarNotaContenido(req: Request, res: Response) {
        const idNotaContenido = req.body.idNotaContenido;
        const notaContenido= req.body.notaContenido;
        const query = `UPDATE nota_contenido SET estado_nota_contenido = 0 WHERE id_nota_contenido=?`;
        Db.query(query,[idNotaContenido,notaContenido], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al eliminar la nota'});
            }
            else {
                res.status(200).json({text: 'Nota eliminada correctamente'});
            }
        });
    }
    public async obtenerPromedioNotasContenido(req: Request, res: Response) {
        const idCurso= req.body.idCurso;
        const query = `SELECT alu.id_alumno,alu.nombre_alumno,alu.ap_paterno_alumno,alu.ap_materno_alumno,AVG(nc.nota_contenido) as promedio
        FROM nota_contenido nc 
        JOIN alumno alu ON
        alu.id_alumno =nc.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno = alu.id_alumno
        JOIN curso cur ON 
        ca.id_curso = cur.id_curso
        JOIN modulo modu ON
        modu.id_curso = cur.id_curso
        JOIN tipo_modulo tm ON
        tm.id_tipo_modulo =modu.id_tipo_modulo
        JOIN contenido_mod_per cmp ON
        cmp.id_modulo = modu.id_modulo 
        WHERE nc.estado_nota_contenido =true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso = true
        AND modu.estado_modulo=1
        AND tm.estado_tipo_modulo = true
        AND cmp.estado_contenido_mod_per=1
        AND cur.id_curso = ?
        AND tm.id_tipo_modulo = ?
        GROUP BY alu.id_alumno`;
        Db.query(query,[idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al obtaner la nota'});
            }
            else {
                res.status(200).json(result);
            }
        });
    }
    public async obtenerPromedioContenidoPorAlumno(req: Request, res: Response) {
        const idAlumno = req.body.idAlumno;
        const idCurso= req.body.idCurso;
        const query = `SELECT  cmp.numero_contenido,cmp.nombre_contenido,AVG(nc.nota_contenido) as promedio
        FROM nota_contenido nc 
        JOIN alumno alu ON
        alu.id_alumno =nc.id_alumno
        JOIN curso_alumno ca ON
        ca.id_alumno = alu.id_alumno
        JOIN curso cur ON 
        ca.id_curso = cur.id_curso
        JOIN modulo modu ON
        modu.id_curso = cur.id_curso
        JOIN tipo_modulo tm ON
        tm.id_tipo_modulo =modu.id_tipo_modulo
        JOIN contenido_mod_per cmp ON
        cmp.id_modulo = modu.id_modulo 
        WHERE nc.estado_nota_contenido =true
        AND alu.estado_alumno = true
        AND ca.estado_curso_alumno = true
        AND cur.estado_curso = true
        AND modu.estado_modulo=1
        AND tm.estado_tipo_modulo = true
        AND cmp.estado_contenido_mod_per=1
        AND cur.id_curso = ?
        AND alu.id_alumno = ?
        AND tm.id_tipo_modulo = 2
        GROUP BY cmp.numero_contenido,cmp.nombre_contenido;`;
        Db.query(query,[idCurso,idAlumno], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al obtener las notas'});
            }
            else {
                res.status(200).json(result);
            }
        });
    }
}

export const contenidoModuloPersonalizadoController = new ContenidoModuloPersonalizadoController();