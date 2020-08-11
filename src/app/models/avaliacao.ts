import { Questao } from './questao';

export interface Avaliacao {
    titulo: string;
    descricao: string;
    dtInicio: string;
    isInicioIndeterminado: boolean;
    dtTermino: string;
    isTerminoIndeterminado: boolean,
    isOrdemAleatoria: boolean,
    isBloqueadoAlunoAtrasado: boolean,
    tipoDisposicao: number,
    tipoCorrecao: number,
    correcaoParesQtdTipo: string,
    correcaoParesQtdNumero: number,
    tipoPontuacao: number,
    questoes: Array<Questao>,
}
