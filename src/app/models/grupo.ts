import { Usuario } from './usuario';

export interface Grupo {
    instanciaId?: number;
    instanciaStatusId?: string;
    alunos?: Array<Usuario>;
}
