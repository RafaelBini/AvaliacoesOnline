export interface Usuario {
    id?: string,
    nome?: string,
    email?: string,
    senha?: string,
    tipo?: string;
    tags?: Array<string>;
    alunos?: Array<Usuario>;
    online?: boolean;
    statusId?: number;
    provaId?: string;
    acesso?: string;
    provaCorrigida?: boolean;
    notaTotal?: number;
    valorTotal?: number;
}
