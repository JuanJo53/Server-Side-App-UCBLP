import{Request,Response} from 'express';
import Db from '../Database'; 

class TestControloler{
public async agregarExamen(req:Request,res:Response){
    const idTema = req.body.idTema;
    const inicioExamen=req.body.inicioExamen;
    const finExamen = req.body.finExamen;
    const preguntasExamen = req.body.preguntasExamen;
    const query =`INSERT INTO examen_tema (id_tema,estado_examen,inicio_examen,fin_examen,tx_id,tx_username,tx_host,tx_date)
    VALUES (?,true,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
    Db.query(query,[idTema,inicioExamen,finExamen],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al crear el examen '});
                throw err;
            }
            else{
                if(preguntasExamen!=null && preguntasExamen.length>0){ 
                const query2=`INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host,tx_date)
                VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
                console.log("Last ID " + result.insertId);
                for(let i=0;i<preguntasExamen.length;i++){
                    Db.query(query2,[preguntasExamen[i].idPregunta,result.insertId,preguntasExamen[i].puntuacion],function(err2,result2,fields2){
                        if(err2){
                            res.status(500).json({text:'Error al registrar las preguntas'});
                            throw err2;
                        }
                        else{
                            //Do nothing
                        }
                    });
                }
            }
                res.status(200).json({text:'Examen creado correctamente'});
            }
        });  
 
    }
    public async modificarExamen(req:Request,res: Response){
        const idExamen = req.body.idExamen;
        const inicioExamen=req.body.inicioExamen;
        const finExamen = req.body.finExamen;
        const query = `UPDATE examen_tema SET inicio_examen = ?,fin_examen =? , tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen =?`;
        Db.query(query,[inicioExamen,finExamen,idExamen],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al modificar el examen'});
                throw err;
            }
            else{
                res.status(200).json({text:'Examen modificado correctamente'});
            }
        });
    }
    public async eliminarExamen(req:Request,res: Response){
        const {id} = req.params;
        const query = `UPDATE examen_tema SET estado_examen=false  WHERE id_examen =?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar el examen'});
                throw err;
            }
            else{
                res.status(200).json({text:'Examen eliminado correctamente'});
            }
        });
    }
    public async agregarPreguntasExamen(req:Request,res: Response){
        const idExamen = req.body.idExamen;
        const preguntasExamen = req.body.preguntasExamen;
        console.log(idExamen);
        console.log(preguntasExamen[0].idPregunta);
        console.log(preguntasExamen[0].puntuacion);
        const query = `INSERT INTO examen_pregunta (id_pregunta,id_examen,puntuacion_examen_pregunta,estado_examen_pregunta,tx_id,tx_username,tx_host,tx_date)
        VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
        for(let i=0;i<preguntasExamen.length;i++){
            Db.query(query,[preguntasExamen[i].idPregunta,idExamen,preguntasExamen[i].puntuacion],function(err,result,fields){
                if(err){
                    res.status(500).json({text:'Error al agregar preguntas al examen'});
                    throw err;
                }
                else{
                    if((i+1)==preguntasExamen.length){
                        res.status(200).json({text:'Preguntas agregadas correctamente'});
                    }
                   
                }
            });
        }
       
    }
    public async modificarPreguntaExamen(req:Request,res:Response){
        const idExamenPregunta = req.body.idExamenPregunta;
        const puntuacion=req.body.puntuacion;
        const query = `UPDATE examen_pregunta SET puntuacion_examen_pregunta = ? ,tx_date = CURRENT_TIMESTAMP()
        WHERE id_examen_pregunta  =?`;
        Db.query(query,[puntuacion,idExamenPregunta],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo modificar la pregunta'});
                throw err;
            }
            else{
                res.status(200).json({text:'Pregunta modificada correctamente'});
            }
        });

    }
    public async listarExamenes(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT examen_tema.id_examen,examen_tema.inicio_examen,examen_tema.fin_examen
        FROM examen_tema INNER JOIN tema ON
        examen_tema.id_tema = tema.id_tema
        WHERE tema.id_tema = ?
        AND examen_tema.estado_examen=true`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los exámenes'});
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
    public async eliminarPreguntaExamen(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE examen_pregunta SET estado_examen_pregunta=false  WHERE id_examen_pregunta =?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar la pregunta'});
                throw err;
            }
            else{
                res.status(200).json({text:'Pregunta eliminada correctamente'});
            }
        });   

    }
    public async listarPreguntasExamen(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT examen_pregunta.id_examen_pregunta,examen_pregunta.id_pregunta,pregunta.codigo_pregunta,
        examen_pregunta.puntuacion_examen_pregunta
        FROM examen_tema INNER JOIN examen_pregunta ON
        examen_tema.id_examen = examen_pregunta.id_examen
        INNER JOIN pregunta ON
        pregunta.id_pregunta = examen_pregunta.id_pregunta
        WHERE examen_pregunta.estado_examen_pregunta  = true
        AND examen_tema.id_examen=?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar los exámenes'});
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
}

export const testController=new TestControloler();