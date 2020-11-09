import { Arquivo } from './arquivo';
export interface Usuario {
    id?: string,
    nome?: string,
    email?: string,
    senha?: string,
    tipo?: string;
    tags?: Array<string>;
    alunos?: Array<Usuario>;
    alunosIds?: Array<string>;
    online?: boolean;
    statusId?: number;
    provaId?: string;
    acesso?: string;
    provaCorrigida?: boolean;
    notaTotal?: number;
    valorTotal?: number;
    dtStatus?: Array<string>;
    img?: Arquivo;
}
