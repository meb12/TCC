import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

  consultas = [
    {
      codigo: '002',
      data: '14/10/2024',
      medico: 'Camila Taglione',
      especialidade: 'Ortopedista',
    },
    {
      codigo: '001',
      data: '08/10/2024',
      medico: 'Juan Mendes',
      especialidade: 'Cardiologista',
    },
  ];

  activateTab(tab: string) {
    this.activeTab = tab;
  }

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); // Emit the close event to the parent component
  }
  onBackdropClick(event: MouseEvent) {
    // Check if the click was outside the modal element
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-container')) {
      this.closeModal();
    }
  }

  constructor() {}

  ngOnInit() {}
}
