// src/components/MintCracha.tsx
import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction} from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../config';
import './MintCracha.css';

export function MintCracha() {
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const [nome, setNome] = useState('');
    const [edicao, setEdicao] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // State for the image URL
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleMint = async () => {
        if (!account) {
            alert('Conecte sua carteira primeiro!');
            return;
        }
        if (!imageUrl.trim()) {
            alert('Por favor, insira uma URL de imagem para o crachá.');
            return;
        }
        
        setIsLoading(true);
        setStatusMessage('✨ Criando o Crachá NFT...');
        
        try {
            const txb = new Transaction();
            txb.moveCall({
                target: `${PACKAGE_ID}::cracha::emitir`,
                arguments: [
                    txb.pure.string(nome), 
                    txb.pure.string(edicao),
                    txb.pure.string(imageUrl),
                ],
            });
            
            const result = await signAndExecute({ transaction: txb });

            console.log('Crachá criado com sucesso, digest:', result.digest);

            alert('Crachá criado com sucesso!');
            
        } catch (error: any) {
            alert(`Erro no processo de criação: ${error.message}`);
        } finally {
            setIsLoading(false);
            setStatusMessage('');
            setNome('');
            setEdicao('');
            setImageUrl('');
        }
    };

    return (
        <div className="mint-container">
            <h3>🎫 Crie seu Crachá do Bootcamp</h3>
            
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={isLoading || !account}
                    className="form-input"
                />

                <input
                    type="text"
                    placeholder="Nome da Edição (ex: Segunda Edição)"
                    value={edicao}
                    onChange={(e) => setEdicao(e.target.value)}
                    disabled={isLoading || !account}
                    className="form-input"
                />

                <input
                    type="url"
                    placeholder="URL da imagem"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={isLoading || !account}
                    className="form-input"
                />
                
                <button 
                    onClick={handleMint} 
                    disabled={isLoading || !account || !nome.trim() || !edicao.trim() || !imageUrl.trim()}
                    className="mint-button"
                >
                    {isLoading ? `⏳ ${statusMessage}` : '🎯 Criar Crachá'}
                </button>
            </div>
            
            {!account && (
                <p className="warning-text">
                    ⚠️ Conecte sua carteira para criar um crachá
                </p>
            )}
        </div>
    );
}