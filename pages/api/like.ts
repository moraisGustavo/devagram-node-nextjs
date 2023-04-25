import type { NextApiRequest, NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { UsuarioModel } from '@/models/UsuarioModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const likeEndpoint 
    = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{
            if(req.method === 'PUT'){

                // ID publicacao
                const {id} = req?.query;
                const publicacao = await PublicacaoModel.findById(id);
                if(!publicacao){
                    return res.status(400).json({erro: ' Publicaçao nao encontrada'});
                }

                //ID usuario
                const {userId} = req?.query;
                const usuario = await UsuarioModel.findById(userId);
                if(!usuario){
                    return res.status(400).json({erro: ' Usuario nao encontrado'});
                }

                // LIKES
                const indexDoUsuarioNoLike = publicacao.likes.findIndex(( e: any) => e.toString() === usuario._id.toString());
                
                // Se o index for > -1 ele ja curte a publicacao                
                if(indexDoUsuarioNoLike != -1){
                    publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                    await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                    return res.status(200).json({msg: 'Publicaco descurtida com sucesso'});
                }else{
                    //  Se o index for -1 ele nao curte a publicacao
                    publicacao.likes.push(usuario._id);
                    await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                    return res.status(200).json({msg: 'Publicaco curtida com sucesso'});
                }

            }

            return res.status(405).json({erro: 'Metodo informado nao é valido'});
        }catch(e){
            console.log(e);
            return res.status(500).json({erro: 'Ocorreu erro ao curti/descurti uma publicaçao'});
        }
    }

    export default  politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));