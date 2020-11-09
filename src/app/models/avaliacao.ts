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
    grupos?: Array<Grupo>;
    alunosIds?: Array<string>;
    maxIntegrantes?: number;
    limitarNumIntegrantes?: boolean;
    usuariosIdQueArquivaram?: Array<string>;
    provas?: Array<string>;
    provaGabarito?: string;

    duracaoIndividualMs?: number;
    duracaoIndividual?: number;
    duracaoIndividualUnidade?: 'segundos' | 'minutos' | 'horas' | 'dias';
    isDuracaoIndividualIndeterminada?: boolean;
    /*
    questoes?: Array<Questao>,
    avaliacoesParaCorrigir?: Array<Avaliacao>;
     */

}
