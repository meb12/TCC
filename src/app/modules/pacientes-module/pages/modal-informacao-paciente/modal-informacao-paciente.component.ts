import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-informacao-paciente',
  templateUrl: './modal-informacao-paciente.component.html',
  styleUrls: ['./modal-informacao-paciente.component.css'],
})
export class ModalInformacaoPacienteComponent implements OnInit {
  data = {
    nome: 'João Silva',
    Cod: '123456',
    date: '12/05/1990',
    sexo: 'Masculino',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    tel: '(11) 1234-5678',
    cel: '(11) 91234-5678',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
  };

  activeTab = 'informacoes';

  activateTab(tab: string) {
    this.activeTab = tab;
  }

  constructor() {}

  ngOnInit() {}
}
