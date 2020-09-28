import { Usuario } from './usuario';

export interface Grupo {
    instanciaId?: string;
    instanciaStatusId?: string;
    alunos?: Array<Usuario>;
    numero?: number;
}
