import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmarSenhaValidator = (
  senha: string,
  confirmarSenha: string
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const valorSenha: string = control.get(senha)?.value;
    const valorConfirmarSenha: string = control.get(confirmarSenha)?.value;
    if (!valorSenha || !valorConfirmarSenha) {
      return {
        senhasDiferentes: 'As senhas não conferem.',
      };
    }
    if (valorConfirmarSenha === valorSenha) {
      return null;
    }
    return {
      senhasDiferentes: 'As senhas não conferem.',
    };
  };
};
