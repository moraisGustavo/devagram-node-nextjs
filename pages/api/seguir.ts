import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { SeguidorModel } from "@/models/SeguidorModel";


const endpointSeguir = 
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) =>{
    try{
        if(req.method === 'PUT'){

            const {userId, id} = req?.query;            
            
            //Usuario Logado/Autenticado
            const usuarioLogado = await UsuarioModel.findById(userId)
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuario Logado nao encontrado'});
            }
            

            // Id do Usuario a ser seguido
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){    
               return res.status(400).json({erro: 'Usuario a ser seguido nao encontrado'}); 
            }

            //Verficar se EU LOGADO sigo ou nao esse usuario
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({ usuarioId: usuarioLogado._id, 
                        usuarioSeguidoId : usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                //Eu ja Sigo esse usuario
                euJaSigoEsseUsuario.forEach(async(e: any) => await SeguidorModel.findByIdAndDelete({_id : e._id}));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg: 'Deixo de seguir o usuario com sucesso'});
            }else{
                //Eu nao aigo esse usuario
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);

                // Adicionar um seguindo no usuario logado
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);


                // Adiconar um seguidor no usuario a ser seguido
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);


                return res.status(200).json({msg: 'Usuario seguido com sucesso'});

            }
                

        }

        return res.status(405).json({erro: 'Metodo informado nao existe'});
    }catch(e){
        console.log(e);
        return res.status(500).json ({erro: 'Nao foi possivel seguir/deseguir o usuario informado'});
    }
}

export default validarTokenJWT(conectarMongoDB(endpointSeguir));