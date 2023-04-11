import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import {validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse) => {
    try{
        //Pegar a id do usuario na query do token
        const {userId} = req?.query;

        //Buscar os dados do usuario no bd
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null; // para nao retornar a senha do usuario
        return res.status(200).json(usuario);    
    }catch(e){
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel obter dados do usuario'});
    }
 }

export  default validarTokenJWT(conectarMongoDB(usuarioEndpoint));