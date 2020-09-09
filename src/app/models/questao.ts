import { OpcaoPreencher } from './opcao-preencher';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Alternativa } from './alternativa';
import { Associacao } from './associacao';
import { Correcao } from './correcao';

export interface Questao {
    id?: string,
    pergunta: string;
    perguntaPlaceholder?: string;
    tipo: number;
    resposta?: string;
    alternativas?: Array<Alternativa>;
    associacoes?: Array<Associacao>;
    valor?: number;
    nivelDificuldade: number;
    tags?: Array<string>;
    extensoes?: Array<string>;
    textoParaPreencher?: string;
    opcoesParaPreencher?: Array<OpcaoPreencher>;
    partesPreencher?: Array<any>;
    correcoes?: Array<Correcao>;
    correcaoProfessor?: Correcao;
    respostaAluno?: string;
    tentativas?: number;
}
