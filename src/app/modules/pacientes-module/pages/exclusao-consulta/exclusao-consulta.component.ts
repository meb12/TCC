import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { ConsultasService } from '../../../../core/services/consultas.service';

@Component({
  selector: 'app-exclusao-consulta',
  templateUrl: './exclusao-consulta.component.html',
  styleUrls: ['./exclusao-consulta.component.css'],
})
export class ExclusaoConsultaComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>(); // Evento para fechar o modal
  @Input() tipo = '';
  @Input()
  item: {
    id: number;
    date: number;
    observation: string;
    isActive: boolean;
    sexo: string;
    dataConsulta: string;
    paciente: string;
  };

  constructor(
    private consultas: ConsultasService,
    private toastr: ToastrService
  ) {}

  formNovo = {};

  ngOnInit() {}

  salvar() {
    const formNovo = {
      id: this.item.id,
      date: this.item.date,
      observation: this.item.observation,
      isActive: false,
    };

    if (this.tipo == 'consulta')
      this.consultas.putData(formNovo).subscribe({
        next: (response) => {
          this.toastr.success('Consulta cancelada com sucesso!');
          this.closeModal.emit();
        },
        error: (error) => {
          this.toastr.error('Erro, tente novamente!');
        },
      });
  }

  // Função para remover a formatação
  unformat(value: string): string {
    if (!value) return '';
    return value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
  }

  closeOnClickOutside(event: MouseEvent) {
    this.closeModal.emit();
  }

  voltar() {
    this.closeModal.emit();
  }
}