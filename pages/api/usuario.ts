import type {NextApiRequest, NextApiResponse,} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import {validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '@/services/uploadImagemCosmic';
import { politicaCORS } from '@/middlewares/politicaCORS';


const handler = nc()
    .use(upload.single('file'))
    .put(async(req : any, res : NextApiResponse<RespostaPadraoMsg>) =>{
        try{
            // Buscar o usuario no BD 
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            //Verifica se o usuario foi encontrado
            if(!usuario){
                return res.status(400).json({erro: 'Usuario nao encontrado'});
            }

            // Buscand o nome no Body
            const {nome} = req?.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }

            // Buscar a imagem 
            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req); // Subir a imagem para o cosmic
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url; 
                }
            }

            // Alterar os dado no db
            await UsuarioModel
            .findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status(200).json({msg: 'Usuario alterado com sucesso'});
            
        }catch(e){
            console.log(e);
            return res.status(400).json({erro: 'Nao foi possivel atualizar usuario'})
        }
    })

    .get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
        try{
            //Pegar a id do usuario na query do token
            const {userId} = req?.query;
            //Buscar os dados do usuario no bd
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null; // para nao retornar a senha do usuario
            return res.status(200).json(usuario);    
        }catch(e){
            console.log(e);
        }
        return res.status(400).json({erro: 'Nao foi possivel obter dados do usuario'});
    });

    export const config = {
        api: {
            bodyParser: false
        }
    }


export  default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));