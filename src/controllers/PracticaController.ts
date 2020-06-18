import{Request,Response} from 'express';
import Db from '../Database'; 

class PreacticaController{
public async agregarPractica(req:Request,res:Response){
    const idLeccion = req.body.idLeccion;
    const nombrePractica = req.body.nombrePractica;
    const numeroPractica = req.body.numeroPractica;
    const inicioPractica=req.body.inicioPractica;
    const finPractica = req.body.finPractica;
    const preguntasPractica = req.body.preguntasPractica;
  
    const query =`INSERT INTO practica (id_leccion,nombre_practica,numero_practica,inicio_practica,fin_practica,estado_practica,tx_id,tx_username,tx_host,tx_date)
    VALUES (?,?,?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
    Db.query(query,[idLeccion,nombrePractica,numeroPractica,inicioPractica,finPractica],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al crear la práctica '});
                throw err;
            }
            else{
                if(preguntasPractica!=null && preguntasPractica.length>0){ 
                    practicaController.agregarPreguntasAPracticaRecienCreada(req,res,result.insertId);    
            }
               res.status(200).json({text:'Práctica creada correctamente'});
            }
        });  
 
    }
    public async agregarPreguntasAPracticaRecienCreada(req:Request,res: Response,idPractica:Number){
        const preguntasPractica = req.body.preguntasPractica;
        console.log(preguntasPractica);
        var valores=[];
        const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica ,tx_id,tx_username,tx_host)
        VALUES ?`;
        for(let i=0;i<preguntasPractica.length;i++){
            valores.push([preguntasPractica[i].idPregunta,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);
            }
            Db.query(query,[valores],function(err,result,fields){
                if(err){
                    res.status(500).json({text:'Error al agregar preguntas a la práctica'});
                    throw err;
                }
                else{
                       //do Nothing    
                }
            });
        
       
    }
    public async modificarPractica(req:Request,res: Response){
        const idPractica = req.body.idPractica;
        const nombrePractica = req.body.nombrePractica;
        const numeroPractica = req.body.numeroPractica;
        const inicioPractica=req.body.inicioPractica;
        const finPractica = req.body.finPractica;
        const query = `UPDATE practica SET nombre_practica = ?,numero_practica=?,inicio_practica=?,fin_practica =? , tx_date = CURRENT_TIMESTAMP()
        WHERE id_practica =?`;
        Db.query(query,[nombrePractica,numeroPractica,inicioPractica,finPractica,idPractica],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al modificar la práctica'});
                throw err;
            }
            else{
                res.status(200).json({text:'Práctica modificada correctamente'});
            }
        });
    }
    public async eliminarPractica(req:Request,res: Response){
        const {id} = req.params;
        const query = `UPDATE practica SET estado_practica=false  WHERE id_practica =?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al eliminar la práctica'});
                throw err;
            }
            else{
                res.status(200).json({text:'Práctica eliminada correctamente'});
            }
        });
    }
    public async agregarPreguntasPractica(req:Request,res: Response){
        const idPractica = req.body.idPractica;
        const preguntasPractica = req.body.preguntasPractica;
        var valores=[];
        const query = `INSERT INTO practica_pregunta (id_pregunta,id_practica,puntuacion_practica_pregunta,estado_pregunta_practica ,tx_id,tx_username,tx_host)
        VALUES ?`;
        for(let i=0;i<preguntasPractica.length;i++){
            valores.push([preguntasPractica[i].idPregunta,idPractica,preguntasPractica[i].puntuacion,true,1,'root','192.168.0.10']);
            }
            Db.query(query,[valores],function(err,result,fields){
                if(err){
                    res.status(500).json({text:'Error al agregar preguntas al examen'});
                    throw err;
                }
                else{
                    
                        res.status(200).json({text:'Preguntas agregadas correctamente'});
                
                   
                }
            });
        
       
    }
    public async modificarPreguntaPractica(req:Request,res:Response){
        const idPracticaPregunta = req.body.idPracticaPregunta;
        const puntuacion=req.body.puntuacion;
        const query = `UPDATE practica_pregunta SET puntuacion_practica_pregunta = ? ,tx_date = CURRENT_TIMESTAMP()
        WHERE id_pregunta_practica   =?`;
        Db.query(query,[puntuacion,idPracticaPregunta],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo modificar la pregunta'});
                throw err;
            }
            else{
                res.status(200).json({text:'Pregunta modificada correctamente'});
            }
        });

    }
    public async listarPracticas(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_practica,practica.fin_practica
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        WHERE leccion.id_leccion=?
        AND practica.estado_practica=true`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'No se pudo listar las practicas'});
            }
            else{
                res.status(200).json(result);
            }
        });   

    }
    public async eliminarPreguntaPractica(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE practica_pregunta SET estado_pregunta_practica=false  WHERE id_pregunta_practica  =?`;
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
    public async listarPreguntasPractica(req:Request,res:Response){
        const {id} = req.params;
        const query =`SELECT practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND practica.id_practica=?`;
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

export const practicaController=new PreacticaController();