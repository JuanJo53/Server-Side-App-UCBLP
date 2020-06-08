import { Request, Response } from 'express';
import Db from '../Database';

class PreguntaController {
    public async listarTipoPregunta(req: Request, res: Response) {
        const query = 'SELECT id_tipo_pregunta,tipo_pregunta FROM tipo_pregunta WHERE estado_tipo_pregunta = true';
        Db.query(query, function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar tipos de pregunta' });
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async listarTipoRespuesta(req: Request, res: Response) {
        const query = 'SELECT id_tipo_respuesta,tipo_respuesta FROM tipo_respuesta WHERE estado_tipo_respuesta = true';
        Db.query(query, function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar tipos de respuesta' });
            }
            else {
                res.status(200).json(result);
            }
        });

    }
    public async agregarPregunta(req: Request, res: Response) {
        const codigoPregunta = req.body.codigoPregunta;
        const idTipoPregunta = req.body.idTipoPregunta;
        const idTipoRespuesta = req.body.idTipoRespuesta;
        const query = `insert into pregunta (codigo_pregunta,id_tipo_pregunta,id_tipo_respuesta,estado_pregunta,tx_id,tx_username,tx_host,tx_date)
        values (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
        Db.query(query, [codigoPregunta, idTipoPregunta, idTipoRespuesta], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al crear la pregutna' });
                throw err;
            }
            else {
                res.status(200).json({ text: 'Pregunta creada correctamente' });
            }
        });

    }
    public async listarPreguntas(req: Request, res: Response) {
        const query = `SELECT pregunta.id_pregunta,pregunta.codigo_pregunta,tipo_pregunta.tipo_pregunta,tipo_respuesta.tipo_respuesta 
        FROM tipo_pregunta INNER JOIN pregunta ON
        tipo_pregunta.id_tipo_pregunta= pregunta.id_tipo_pregunta
        INNER JOIN tipo_respuesta ON
        tipo_respuesta.id_tipo_respuesta = pregunta.id_tipo_respuesta
        WHERE pregunta.estado_pregunta = true`;
        Db.query(query, function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al cargar las preguntas' });
            }
            else {
                res.status(200).json(result);
            }
        });

    }
}

export const preguntaController = new PreguntaController();