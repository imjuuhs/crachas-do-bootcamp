// src/components/DisplayCracha.tsx
import { useEffect, useState } from 'react';
import { SuiClient } from '@mysten/sui/client';
import { CRACHA_ID, NETWORK } from '../config';
import './DisplayCracha.css';

interface CrachaData {
    nome: string;
    edicao_bootcamp: number;
}

export function DisplayCracha() {
    const [crachaData, setCrachaData] = useState<CrachaData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCracha() {
            setIsLoading(true);
            setError(null);
            
            try {
                const client = new SuiClient({ 
                    url: `https://fullnode.${NETWORK}.sui.io:443` 
                });
                
                const objectResponse = await client.getObject({
                    id: CRACHA_ID,
                    options: { showContent: true },
                });

                if (objectResponse.data?.content?.dataType !== 'moveObject') {
                    throw new Error("O objeto não é um Move Object");
                }

                const fields = (objectResponse.data.content as any).fields;
                setCrachaData({
                    nome: fields.nome,
                    edicao_bootcamp: parseInt(fields.edicao_bootcamp),
                });
                
            } catch (err) {
                console.error('Erro ao buscar crachá:', err);
                setError('Não foi possível carregar o crachá');
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchCracha();
    }, []);

    if (isLoading) {
        return (
            <div className="cracha-card">
                <div>⏳ Carregando crachá...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="cracha-card error">
                <div>❌ {error}</div>
                <small>ID: {CRACHA_ID}</small>
            </div>
        );
    }
    
    if (!crachaData) {
        return (
            <div className="cracha-card error">
                <div>❌ Crachá não encontrado</div>
            </div>
        );
    }

    return (
        <div className="cracha-card">
            <h3>🎫 Crachá Bootcamp SUI</h3>
            <div className="cracha-info">
                <p><strong>👤 Nome:</strong> {crachaData.nome}</p>
                <p><strong>📚 Edição:</strong> {crachaData.edicao_bootcamp}</p>
            </div>
            <div className="cracha-id">
                <small>ID: {CRACHA_ID}</small>
            </div>
        </div>
    );
}