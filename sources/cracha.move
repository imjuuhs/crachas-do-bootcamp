module cracha::cracha {

    use std::string::String;

    /// Objeto que representa o crachá de um participante do bootcamp
    public struct Cracha has key, store {
        id: UID,
        nome: String,
        edicao_bootcamp: u64,
    }

    /// Função que é chamada uma única vez para publicar o módulo
    fun init(_ctx: &mut TxContext) {
        // Inicialização do módulo (se necessário)
    }

    /// Função que cria e emite um crachá para o participante
    entry fun emitir(nome: String, ctx: &mut TxContext) {
        let cracha = Cracha {
            id: object::new(ctx),
            nome,
            edicao_bootcamp: 2,
        };

        // Transfere o crachá para o remetente da transação
        transfer::transfer(cracha, tx_context::sender(ctx));
    }

    /// Função para obter o nome do portador do crachá
    public fun get_nome(cracha: &Cracha): String {
        cracha.nome
    }

    /// Função para obter a edição do bootcamp
    public fun get_edicao_bootcamp(cracha: &Cracha): u64 {
        cracha.edicao_bootcamp
    }

    /// Função para atualizar o nome no crachá (apenas o proprietário pode fazer isso)
    public fun atualizar_nome(cracha: &mut Cracha, novo_nome: String) {
        cracha.nome = novo_nome;
    }
}