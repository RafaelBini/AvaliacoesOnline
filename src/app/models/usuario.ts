export interface Usuario {

    matricula?: string,
    nome: string,
    email: string,
    senha: string,
    tipo: string;
    tags?: Array<string>;
}
