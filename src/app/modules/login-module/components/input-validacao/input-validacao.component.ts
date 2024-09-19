import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MensagensValidação } from '../../../../core/interfaces/mensagensValidacao';

const VALIDATORS_MESSAGES: MensagensValidação = {
  required: 'Obrigatório',
  email: 'E-mail inválido',
  password: 'E-mail ou senha incorretos',
  notMatch: 'As senhas não são iguais',
};

@Component({
  selector: 'app-input-validacao',
  templateUrl: './input-validacao.component.html',
  styleUrls: ['./input-validacao.component.css'],
})
export class InputValidacaoComponent implements OnInit {
  @Input() control!: AbstractControl;

  getErrorMessage(errorKey: string): string {
    return VALIDATORS_MESSAGES[errorKey] || '';
  }
  constructor() {}

  ngOnInit() {}
}
