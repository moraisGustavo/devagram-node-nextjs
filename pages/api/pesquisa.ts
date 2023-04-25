import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { politicaCORS } from '@/middlewares/politicaCORS';


const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
        if (req.method === 'GET') {
            if (req?.query?.id) {
                //Busca de Usuario pelo Id
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro: 'Usuario nao encontrado'});
                }
                
                usuarioEncontrado.senha = null;
                return res.status(200).json(usuarioEncontrado);
            } else {
               
                //Buscar por Nome
                const { filtro } = req.query;
                if (!filtro || filtro.length < 2) {
                    return res.status(400).json({ erro: 'Favor informar pelo menos 2 caracteres' });
                }

                const usuariosEncontrados = await UsuarioModel.find({
                    $or: [{ nome: { $regex: filtro, $options: 'i' } },
                        //{email : {$regex : filtro, $options: 'i'}}
                    ]
                });

                return res.status(200).json(usuariosEncontrados);
            }

        }
        return res.status(405).json({ erro: 'Metodo informado nao e valido' });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Nao foi possivel buscar usuario' });
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(pesquisaEndpoint)));