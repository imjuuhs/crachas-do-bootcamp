// src/components/MeusCrachas.tsx
import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import type { SuiObjectResponse } from '@mysten/sui.js/client';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { PACKAGE_ID } from '../config';
import './MeusCrachas.css';

// Definindo um tipo para os dados do crachá para melhor organização
type CrachaData = {
    nome: string;
    edicao_bootcamp: string;
    image_url: string;
};

export function MeusCrachas() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [crachas, setCrachas] = useState<CrachaData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCrachas = async () => {
            if (!account) {
                setCrachas([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const crachaType = `${PACKAGE_ID}::cracha::Cracha`;
                
                // Busca todos os objetos que o usuário possui
                const objects = await suiClient.getOwnedObjects({
                    owner: account.address,
                    filter: {
                        StructType: crachaType,
                    },
                    options: {
                        showContent: true, // Precisamos do conteúdo para obter os campos
                    },
                });

                // Extrai e formata os dados dos crachás
                const crachasData = objects.data
                    .map((obj: SuiObjectResponse) => {
                        if (obj.data?.content?.dataType === 'moveObject') {
                            const fields = obj.data.content.fields as any;
                            return {
                                nome: fields.nome,
                                edicao_bootcamp: fields.edicao_bootcamp,
                                image_url: fields.image_url,
                            };
                        }
                        return null;
                    })
                    .filter((cracha): cracha is CrachaData => cracha !== null);

                setCrachas(crachasData);

            } catch (err) {
                console.error('Erro ao buscar crachás:', err);
                setError('Não foi possível buscar os crachás. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrachas();
    }, [account, suiClient]);

    if (!account) {
        return (
            <div className="meus-crachas-container warning-text">
                <p>⚠️ Conecte sua carteira para ver seus crachás.</p>
            </div>
        );
    }
    
    if (isLoading) {
        return <div className="meus-crachas-container"><p>🔍 Buscando seus crachás...</p></div>;
    }

    if (error) {
        return <div className="meus-crachas-container error-text"><p>{error}</p></div>;
    }

    return (
        <div className="meus-crachas-container">
            <h3>Meus Crachás</h3>
            {crachas.length > 0 ? (
                <div className="crachas-grid">
                    {crachas.map((cracha, index) => (
                        <div key={index} className="cracha-card">
                            <img src={cracha.image_url} alt={`Crachá de ${cracha.nome}`} className="cracha-image" />
                            <div className="cracha-info">
                                <h4>{cracha.nome}</h4>
                                <p>{cracha.edicao_bootcamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Você ainda não possui nenhum crachá.</p>
            )}
        </div>
    );
}
