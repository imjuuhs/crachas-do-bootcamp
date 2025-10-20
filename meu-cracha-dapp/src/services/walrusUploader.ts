// src/services/walrusUploader.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { WalrusClient } from "@mysten/walrus";
import walrusWasmUrl from "@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url";
import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";

export const suiClient = new SuiClient({
  url: getFullnodeUrl("mainnet"),
});



export const walrusClient = new WalrusClient({
    network: "mainnet",
    suiClient,
    wasmUrl: walrusWasmUrl,
});

// 1. Pega as credenciais das variáveis de ambiente
const WALRUS_ENDPOINT = import.meta.env.VITE_WALRUS_ENDPOINT;
const WALRUS_REGION = import.meta.env.VITE_WALRUS_REGION;
const WALRUS_ACCESS_KEY_ID = import.meta.env.VITE_WALRUS_ACCESS_KEY_ID;
const WALRUS_SECRET_ACCESS_KEY = import.meta.env.VITE_WALRUS_SECRET_ACCESS_KEY;
const BUCKET_NAME = import.meta.env.VITE_WALRUS_BUCKET_NAME;

// Validação para garantir que as variáveis foram carregadas
if (!WALRUS_ENDPOINT || !WALRUS_ACCESS_KEY_ID || !WALRUS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
    throw new Error("As variáveis de ambiente do Walrus não foram configuradas corretamente no arquivo .env.local");
}

// 2. Configura o cliente S3 para se conectar ao Walrus
const s3Client = new S3Client({
    endpoint: WALRUS_ENDPOINT,
    region: WALRUS_REGION,
    credentials: {
        accessKeyId: WALRUS_ACCESS_KEY_ID,
        secretAccessKey: WALRUS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Essencial para a maioria das implementações S3-compatíveis
});

// 3. Função que faz o upload do arquivo
export const uploadToWalrus = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: file.type,
    });

    await s3Client.send(command);

    // Retorna a URL pública do arquivo
    return `${WALRUS_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
};