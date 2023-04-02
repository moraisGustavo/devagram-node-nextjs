import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const endppointLogin = (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if( req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admin@admin.com' &&
            senha === 'admin123' ){
                return res.status(200).json({msg: 'Usuário autenticado com sucesso'})

            }
            return res.status(400).json({erro : 'Usuário ou senha incorreto'});
    }
    return res.status(405).json({erro : 'Metodo informado nao é valido'});
}

export default conectarMongoDB(endppointLogin);