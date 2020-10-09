import { Usuario } from './usuario';

export interface Grupo {
    provaId?: string;
    instanciaStatusId?: string;
    alunos?: Array<Usuario>;
    numero?: number;
}
