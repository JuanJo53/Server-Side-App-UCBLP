import{Request,Response} from 'express';
import Db from '../Database'; 

class ImageController{
public async listarImagenes(req:Request,res:Response){
        const query ='SELECT id_imagen,imagen FROM imagen WHERE estado_imagen = true';
        Db.query(query,function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar imagenes'});
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
}

export const imageController=new ImageController();