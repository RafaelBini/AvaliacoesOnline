export interface Usuario {
    nome?: string,
    email?: string,
    senha?: string,
    tipo?: string;
    tags?: Array<string>;
    online?: boolean;
    statusId?: number;
    instanciaId?: string;
}
