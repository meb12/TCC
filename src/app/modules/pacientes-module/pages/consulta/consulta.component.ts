import { Component, Input, OnInit } from '@angular/core';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
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

  form: any = {
    especialidades: '',
    medico: '',
    date: '',
    horario: '',
    observacao: 0,
  };

  medicosOptions = [
    {
      value: 1,
      name: 'Dr. João Silva',
    },
    {
      value: 2,
      name: 'Dra. Maria Oliveira',
    },
    {
      value: 3,
      name: 'Dr. Pedro Souza',
    },
  ];

  horariosIndisponiveis = ['09:15', '10:00', '11:30', '14:15', '16:00'];

  horarioOptions = [];

  onEspecialidadeChange(especialidadeValue: any) {
    const especialidade = this.especialidadesOptions.find(
      (e) => e.value === especialidadeValue
    );
    if (especialidade) {
      this.gerarHorarioOptions(especialidade.intervalo);
    }
  }

  especialidadesOptions = [
    {
      value: 1,
      name: 'Cardiologia',
      intervalo: 15,
    },
    {
      value: 2,
      name: 'Dermatologia',
      intervalo: 30,
    },
    {
      value: 3,
      name: 'Ortopedia',
      intervalo: 60,
    },
  ];

  gerarHorarioOptions(intervalo: number) {
    const horarioInicial = 9 * 60; // 09:00 em minutos
    const horarioFinal = 18 * 60; // 18:00 em minutos
    const horariosDisponiveis = [];

    for (
      let minutos = horarioInicial;
      minutos < horarioFinal;
      minutos += intervalo
    ) {
      const horas = Math.floor(minutos / 60);
      const min = minutos % 60;
      const horario = `${String(horas).padStart(2, '0')}:${String(min).padStart(
        2,
        '0'
      )}`;

      // Adiciona apenas os horários que não estão indisponíveis
      if (!this.horariosIndisponiveis.includes(horario)) {
        horariosDisponiveis.push({ value: horario, name: horario });
      }
    }

    this.horarioOptions = horariosDisponiveis;
  }

  voltar() {
    this.router.navigate(['/medicos/listagem']);
  }
  constructor(
    private especialidades: EspecialidadeService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Especialidades:', this.especialidades);
    this.especialidades.getData().subscribe({
      next: (response) => {
        this.especialidades = response;
        console.log('Especialidades:', this.especialidades);
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }
}
