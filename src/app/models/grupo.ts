import { BooleanInput } from '@angular/cdk/coercion';
import { Usuario } from './usuario';

export interface Grupo {
    provaId?: string;
    provaCorrigida?: boolean;
    alunos?: Array<Usuario>;
    numero?: number;
    notaTotal?: number;
    valorTotal?: number;
}
