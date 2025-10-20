module cracha::cracha {
    use std::string::String;
    use sui::object;
    use sui::tx_context;
    use sui::transfer;

    /// Estrutura que representa o crachá de um participante do bootcamp
    public struct Cracha has key, store {
        id: UID,
        nome: String,
        edicao_bootcamp: String,
        image_url: String,
    }

    /// Função que cria e emite um crachá para o participante
    public entry fun emitir(
        nome: String,
        edicao_bootcamp: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let cracha = Cracha {
            id: object::new(ctx),
            nome,
            edicao_bootcamp,
            image_url,
        };

        transfer::transfer(cracha, tx_context::sender(ctx));
    }

    /// Função para obter o nome do portador do crachá
    public fun get_nome(cracha: &Cracha): String {
        cracha.nome
    }

    /// Função para obter a edição do bootcamp
    public fun get_edicao_bootcamp(cracha: &Cracha): String {
        cracha.edicao_bootcamp
    }

    /// Função para atualizar o nome no crachá (apenas o proprietário pode fazer isso)
    public fun atualizar_nome(cracha: &mut Cracha, novo_nome: String) {
        cracha.nome = novo_nome;
    }
}
