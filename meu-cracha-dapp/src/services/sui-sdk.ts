// src/services/sui-sdk.ts
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { WalletContextState } from '@mysten/dapp-kit';
import { PACKAGE_ID } from '../config';

const suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

// --- TIPO DE DADO PARA O NOSSO CRACHÁ ---
// Isso ajuda o TypeScript a entender a estrutura do nosso objeto
export interface CrachaData {
    nome: string;
    edicao_bootcamp: string; // Vem como string da API, mesmo sendo u64 no Move
}


// --- FUNÇÃO DE LEITURA (READ) ---
// Busca os dados de um objeto Cracha específico. Não precisa de assinatura.
export async function getCrachaDetails(objectId: string): Promise<CrachaData | null> {
    try {
        const objectResponse = await suiClient.getObject({
            id: objectId,
            options: { showContent: true },
        });

        if (objectResponse.data?.content?.dataType !== 'moveObject') {
            console.error("O objeto não é um Move Object");
            return null;
        }

        // Acessamos os campos do nosso struct
        const fields = objectResponse.data.content.fields as any;
        return {
            nome: fields.nome,
            edicao_bootcamp: fields.edicao_bootcamp,
        };
    } catch (error) {
        console.error("Erro ao buscar detalhes do crachá:", error);
        return null;
    }
}


// --- FUNÇÃO DE ESCRITA (WRITE) ---
// Cria um novo Crachá. Precisa de uma carteira para assinar.
export async function mintCracha(signer: WalletContextState, nome: string) {
    if (!signer.account) throw new Error('Carteira não conectada');

    const txb = new TransactionBlock();

    txb.moveCall({
        target: `${PACKAGE_ID}::cracha::emitir`,
        arguments: [txb.pure.string(nome)],
    });

    // Pedimos para a carteira assinar e executar a transação
    return signer.signAndExecuteTransactionBlock({
        transactionBlock: txb,
    });
}