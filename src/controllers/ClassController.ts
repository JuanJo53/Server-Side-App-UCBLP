import{Request,Response} from 'express';
import Db from '../Database'; 

class ClassController{

    public async listaAlumnos(req:Request,res:Response){
        const {id}=req.params;
        console.log("ID Curso: "+id);
    }

}


export const classController=new ClassController();