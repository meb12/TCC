import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PacientesService } from '../../../../core/services/pacientes.service';

@Component({
  selector: 'app-exclusao-modal-paciente',
  templateUrl: './exclusao-modal-paciente.component.html',
  styleUrls: ['./exclusao-modal-paciente.component.css'],
})
export class ExclusaoModalPacienteComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>(); // Evento para fechar o modal
  @Input() tipo = '';
  @Input()
  item: {
    id: number;
    description: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
    cellphone: string;
    cep: string;
    city: string;
    complement: string;
    cpf: string;
    dateOfBirth: string; // ou Date se preferir usar um objeto de data
    doctorData: {
      crm: string;
      observation: string;
      specialtyType: {
        id: number;
        intervalBetweenAppointments: string;
        isActive: boolean;
        description: string;
      };
    };
    documentNumber: string;
    email: string;
    gender: string;
    login: string;
    name: string;
    neighborhood: string;
    pacientData: {
      allergies: Array<{ id: number; allergy: string }>;
    };
    stateName: string | null;
    streetName: string;
    streetNumber: number;
    userType: {
      id: number;
      name: string;
      isActive: boolean;
    };
  };

  constructor(
    private pacientes: PacientesService,
    private toastr: ToastrService
  ) {}

  formNovo = {};

  ngOnInit() {
    console.log('item recebido', this.item);
  }

  salvar() {
    const formNovo = {
      id: this.item.id,
      cpf: this.item.cpf,
      documentNumber: this.item.documentNumber,
      name: this.item.name,
      dateOfBirth: this.item.dateOfBirth,
      email: this.item.email,
      cellphone: this.item.cellphone,
      userTypeId: this.item.userType.id,
      streetName: this.item.streetName,
      streetNumber: this.item.streetNumber,
      complement: this.item.complement,
      neighborhood: this.item.neighborhood,
      state: this.item.stateName,
      cep: this.item.cep,
      city: this.item.city,
      gender: this.item.gender,
      login: this.item.email,
      isActive: false,
      pacientData: {
        allergies: this.item.pacientData?.allergies
          ? [...this.item.pacientData.allergies]
          : [],
      },
    };

    this.pacientes.putData(formNovo).subscribe({
      next: (response) => {
        this.toastr.success('Paciente desativado com sucesso!');
        this.closeModal.emit();
      },
      error: (error) => {
        this.toastr.error('Erro, tente novamente!');
      },
    });
  }

  closeOnClickOutside(event: MouseEvent) {
    this.closeModal.emit();
  }

  voltar() {
    this.closeModal.emit();
  }
}
