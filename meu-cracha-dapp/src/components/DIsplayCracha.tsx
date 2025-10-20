// src/components/DisplayCracha.tsx
import { useEffect, useState } from 'react';
import { SuiClient, getFullnodeUrl, type SuiMoveObject } from '@mysten/sui.js/client';
import { CRACHA_ID, NETWORK } from '../config';
import './DisplayCracha.css';

interface CrachaData {
    nome: string;
    edicao_bootcamp: number;
}

// Tipagem para os campos específicos do nosso Move Object
type CrachaFields = {
    nome: string;
    edicao_bootcamp: string; // A RPC da Sui geralmente retorna números como strings
}

function isCrachaFields(fields: any): fields is CrachaFields {
    // Corrigido: Validar os campos que realmente existem no seu contrato
    return fields && typeof fields.nome === 'string' && typeof fields.edicao_bootcamp === 'string';
}

function getEdicaoTexto(numero: number): string {
    switch (numero) {
        case 1:
            return "Primeira Edição";
        case 2:
            return "Segunda Edição";
        default:
            return `Edição #${numero}`;
    }
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
                // Usa getFullnodeUrl para mais robustez
                const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });
                
                const objectResponse = await client.getObject({
                    id: CRACHA_ID, // Usa o ID importado do '../config'
                    options: { showContent: true },
                });

                const content = objectResponse.data?.content;

                if (content?.dataType !== 'moveObject') {
                    throw new Error("O objeto não é um Move Object ou não foi encontrado.");
                }

                // Acessa os campos do Move Object com a tipagem correta (SuiMoveObject)
                const fields = (content as SuiMoveObject).fields;

                if (!isCrachaFields(fields)) {
                    throw new Error("Os campos do objeto Crachá são inválidos ou não correspondem ao esperado.");
                }

                setCrachaData({
                    nome: fields.nome,
                    // Corrigido: Converter a string 'edicao_bootcamp' para número
                    edicao_bootcamp: parseInt(fields.edicao_bootcamp, 10),
                });
                
            } catch (err) {
                console.error('Erro ao buscar crachá:', err);
                const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
                setError(`Falha ao carregar o crachá: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchCracha();
    }, []);

    // --- Lógica de Renderização ---

    if (isLoading) {
        return (
            <div className="cracha-card loading">
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

    // Renderização final com o texto da edição
    return (
        <div className="cracha-card">
            <h3>🎫 Crachá Bootcamp SUI</h3>
            <div className="cracha-info">
                <p><strong>👤 Nome:</strong> {crachaData.nome}</p>
                <p>
                    <strong>📚 Edição:</strong> {getEdicaoTexto(crachaData.edicao_bootcamp)}
                </p>
            </div>
            <div className="cracha-id">
                <small>ID: {CRACHA_ID}</small>
            </div>
        </div>
    );}