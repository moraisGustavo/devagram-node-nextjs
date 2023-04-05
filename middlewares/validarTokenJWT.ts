import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type { RespostaPadraoMsg} from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler : NextApiHandler) => 
    (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

       try{
        //Validaçao da chave de acesso
        const {MINHA_CHAVE_JWT} = process.env;
        if(!MINHA_CHAVE_JWT){
            return res.status(500).json({ erro : 'ENV chave JWT nao informado na execucao do processo'})
        }

        // Validaçao se tem algum header
        if(!req || !req.headers){
            return res.status(401).json({erro : 'Nao foi possivel validar o token de acesso' })
        } 


        //Validaçao se o metodo é diferente de OPTIONS, se for igual a OPTIONS segue a vida.
        if(req.method !== 'OPTIONS'){
            const authorization = req.headers['authorization']; // Validaçao se retorno header de autorizaçao.
            if(!authorization){
                return res.status(401).json({erro : 'Nao foi possivel validar o token de acesso' });
            }
                const token = authorization.substring(7); // Validaçao se retorno o TOKEN.
        if(!token){
            return res.status(401).json({erro : 'Nao foi possivel validar o token de acesso' });
            }
            

            // Verificaçao com o JWT se o token corresponde com a Chave.
            const  decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
            if(!decoded){
                return res.status(401).json({erro : 'Nao foi possivel validar o token de acesso' });
            }

            
            if(req.query){          //Verifica se tem uma query na requisiçao
                req.query = {};     // Caso nao tenha , cria uma vazia
            }
            
            // Adiciona na query o nosso usuario.
            req.query.userId = decoded._id;
            
        }

       }catch(e){
        console.log(e);
        return res.status(401).json({erro : 'Nao foi possivel validar o token de acesso' });
       }
       

        return handler(req, res);
    }