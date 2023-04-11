import type {NextApiRequest, NextApiResponse} from 'next';
import {validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import { UsuarioModel } from '@/models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            console.log(req.method);
            // Receber uma Id do usuario
            if(req?.query?.id){
                console.log(req.query.id);
                // Validacao do usuario
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro: 'Usuario nao encontrado'});
                }

                // Buscar pela publicacao
                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});

                return res.status(200).json(publicacoes);
            }
        }
        return res.status(405).json({erro: 'Metodo informado invalido'});
    }catch(e){
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel obter o feed'});
    }
}

export default  validarTokenJWT(conectarMongoDB(feedEndpoint));
