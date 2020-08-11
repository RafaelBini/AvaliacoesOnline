import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Alternativa } from './alternativa';

export interface Questao {
    pergunta: string;
    tipo: number;
    resposta: string;
    alternativas: Array<Alternativa>;
    valor: number;
    nivelDificuldade: number;
}
