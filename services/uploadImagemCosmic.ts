import multer from "multer";
import cosmicjs from "cosmicjs";

// Variaveis de Ambiente
const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES,
    } = process.env;

//Instancia do Cosmic
const Cosmic = cosmicjs();

// Bucket de Avatares
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key:CHAVE_GRAVACAO_AVATARES
});

// Bucket de Publicacoes
const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES 
});

// Criacao do storage onde o multe grava a imagem
const storage = multer.memoryStorage();
const upload = multer({storage : storage});

// Funcao de upload do multer para o cosmic
const uploadImagemCosmic  = async(req : any) => {
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{
            return await bucketAvatares.addMedia({media : media_object});
        };
    }
}

export {upload, uploadImagemCosmic};
