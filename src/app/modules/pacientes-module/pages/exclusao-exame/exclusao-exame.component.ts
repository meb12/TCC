import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { RetornosService } from '../../../../core/services/retornos.service';
import { DocumentosService } from '../../../../core/services/documentos.service';

@Component({
  selector: 'app-exclusao-exame',
  templateUrl: 'exclusao-exame.component.html',
  styleUrls: ['./exclusao-exame.component.css'],
})
export class ExclusaoExameComponent implements OnInit {
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
    private toastr: ToastrService,
    private documentos: DocumentosService,
    private retornos: RetornosService
  ) {}

  ngOnInit() {}

  salvar() {
    this.documentos.deleteData(this.item, this.tipo).subscribe({
      next: (response) => {
        this.toastr.success('Arquivo excluído com sucesso!');
        this.closeModal.emit();
      },
      error: (error) => {
        console.error('Erro ao enviar o arquivo:', error);
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
