import { Avaliacao } from './avaliacao';
import { Questao } from './questao';
import { Usuario } from './usuario';

export interface Prova {
    id?: string,
    avaliacaoId?: string,
    dtInicio?: string;
    dtInicioCorrecao?: string;
    dtTermino?: string;
    questoes?: Array<Questao>,
    status?: number,
    alunos?: Array<Usuario>;
    provasParaCorrigir?: Array<Prova>;
    isGabarito?: boolean;
    corrigida?: boolean;
}