import { Questao } from './questao';
import { Grupo } from './grupo';
import { Usuario } from './usuario';

export interface Avaliacao {
    id?: string,
    titulo?: string;
    descricao?: string;
    professorId?: string,
    professorNome?: string,
    dtInicio?: string;
    isInicioIndeterminado?: boolean;
    dtInicioCorrecao?: string;
    isInicioCorrecaoIndeterminado?: boolean;
    dtTermino?: string;
    isTerminoIndeterminado?: boolean,
    isOrdemAleatoria?: boolean,
    isBloqueadoAlunoAtrasado?: boolean,
    tipoDisposicao?: number,
    tipoCorrecao?: number,
    correcaoParesQtdTipo?: string,
    correcaoParesQtdNumero?: number,
    tipoPontuacao?: number,
    tags?: Array<string>,
    status?: number,
    alunos?: Array<Usuario>;
    grupos?: Array<Grupo>;
    maxIntegrantes?: number;
    limitarNumIntegrantes?: boolean;
    isArquivada?: boolean;
    provas?: Array<string>;
    provaGabarito?: string;

    /*
    questoes?: Array<Questao>,
    avaliacoesParaCorrigir?: Array<Avaliacao>;
     */
}
