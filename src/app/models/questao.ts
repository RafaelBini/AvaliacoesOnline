import { Avaliacao } from 'src/app/models/avaliacao';
import { OpcaoPreencher } from './opcao-preencher';
import { Alternativa } from './alternativa';
import { Associacao } from './associacao';
import { Correcao } from './correcao';
import { Usuario } from './usuario';
import { Arquivo } from './arquivo';


export interface Questao {
    id?: string,
    pergunta?: string;
    perguntaPlaceholder?: string;
    tipo?: number;
    resposta?: string;
    alternativas?: Array<Alternativa>;
    associacoes?: Array<Associacao>;
    valor?: number;
    nivelDificuldade?: number;
    tags?: Array<string>;
    extensoes?: Array<string>;
    arquivosEntregues?: Array<Arquivo>;
    imagensEntregues?: Array<Arquivo>;
    textoParaPreencher?: string;
    opcoesParaPreencher?: Array<OpcaoPreencher>;
    partesPreencher?: Array<{ tipo: 'texto' | 'select', conteudo: any }>;
    correcoes?: Array<Correcao>;
    correcaoProfessor?: Correcao;
    tentativas?: number;
    ultimaModificacao?: number;
    usuarioUltimaModificacao?: Usuario;
    isValidadaCorreta?: boolean;
    anexos?: Array<Arquivo>;
    imagens?: Array<Arquivo>;
    isEditando?: boolean;
    isPublica?: boolean;
    avaliacao?: Avaliacao;
}
