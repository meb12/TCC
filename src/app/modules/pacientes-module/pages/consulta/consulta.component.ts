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
      especialidadeId: 1, // Unique ID for the specialty
      especialidade: 'Cardiologia',
      intervaloConsulta: '30 minutos',
    },
    {
      value: 2,
      name: 'Dra. Maria Oliveira',
      especialidadeId: 1,
      especialidade: 'Pediatria',
      intervaloConsulta: '1 hora',
    },
    {
      value: 3,
      name: 'Dr. Pedro Souza',
      especialidadeId: 1,
      especialidade: 'Dermatologia',
      intervaloConsulta: '45 minutos',
    },
    {
      value: 4,
      name: 'Dra. Ana Costa',
      especialidadeId: 2,
      especialidade: 'Oftalmologia',
      intervaloConsulta: '1 hora',
    },
    {
      value: 5,
      name: 'Dr. Carlos Mendes',
      especialidadeId: 2,
      especialidade: 'Ginecologia',
      intervaloConsulta: '30 minutos',
    },
    {
      value: 6,
      name: 'Dra. Sofia Lima',
      especialidadeId: 2,
      especialidade: 'Ortopedia',
      intervaloConsulta: '1 hora',
    },
    {
      value: 7,
      name: 'Dr. Lucas Pereira',
      especialidadeId: 3,
      especialidade: 'Neurologia',
      intervaloConsulta: '30 minutos',
    },
    {
      value: 8,
      name: 'Dra. Fernanda Ribeiro',
      especialidadeId: 3,
      especialidade: 'Endocrinologia',
      intervaloConsulta: '45 minutos',
    },
    {
      value: 9,
      name: 'Dr. Roberto Almeida',
      especialidadeId: 4,
      especialidade: 'Geriatria',
      intervaloConsulta: '1 hora',
    },
    {
      value: 10,
      name: 'Dra. Vanessa Martins',
      especialidadeId: 4,
      especialidade: 'Psiquiatria',
      intervaloConsulta: '30 minutos',
    },
  ];

  filteredMedicos: any[] = [];

  unavailableTimes = {
    doctorId: 1,
    doctorName: 'Dr. João Silva',
    spcialty: [{ name: 'Cardiologista', id: 2, interval: '01:30' }],
    unavailableTimes: ['09:00', '15:00'],
  };
  especialidadesData: any[] = [];

  horarioOptions = [];

  onEspecialidadeChange(especialidadeValue: number) {
    this.form.medico = '';
    this.form.date = '';
    // Filter the medicos based on the selected especialidadeId
    this.filteredMedicos = this.medicosOptions.filter(
      (medico) => medico.especialidadeId === especialidadeValue
    );
  }

  onMedicoChange(medicoValue: any) {
    this.getHorariosDisponiveis();
  }

  onDateChange(dateValue: any) {
    this.getHorariosDisponiveis();
  }

  getHorariosDisponiveis() {
    const horariosFuncionamento = [];
    const inicio = 9; // 9h
    const fim = 18; // 18h
    // Extrair o intervalo da especialidade
    const especialidade = this.unavailableTimes.spcialty[0];
    const intervalo =
      parseInt(especialidade.interval.split(':')[0]) * 60 +
      parseInt(especialidade.interval.split(':')[1]); // Intervalo em minutos
    let minutosTotais = inicio * 60; // Converter o horário de início em minutos
    // Criar todos os horários disponíveis no intervalo de funcionamento
    while (minutosTotais < fim * 60) {
      // Enquanto dentro do horário de funcionamento
      const horas = Math.floor(minutosTotais / 60);
      const minutos = minutosTotais % 60;
      const horaFormatada = String(horas).padStart(2, '0');
      const minutoFormatado = String(minutos).padStart(2, '0');
      horariosFuncionamento.push(`${horaFormatada}:${minutoFormatado}`);
      minutosTotais += intervalo; // Avançar pelo intervalo definido
    }
    // Pegar os horários indisponíveis do objeto
    const unavailableTimes = this.unavailableTimes.unavailableTimes;
    // Filtrar horários disponíveis removendo os horários indisponíveis
    const horariosDisponiveis = horariosFuncionamento.filter((horario) => {
      const horarioMinuto =
        parseInt(horario.split(':')[0]) * 60 + parseInt(horario.split(':')[1]);
      if (unavailableTimes.includes(horario)) {
        return false;
      }
      // Verificar se existe um horário que começa dentro do intervalo de indisponibilidade
      for (let i = 0; i < unavailableTimes.length; i++) {
        const unavailableMinuto =
          parseInt(unavailableTimes[i].split(':')[0]) * 60 +
          parseInt(unavailableTimes[i].split(':')[1]);
        if (
          horarioMinuto >= unavailableMinuto &&
          horarioMinuto < unavailableMinuto + intervalo
        ) {
          return false;
        }
      }
      return true;
    });
    // Formatar horários disponíveis
    const horariosDisponiveisFormatados = horariosDisponiveis.map(
      (horario) => ({
        value: horario,
        name: horario,
      })
    );
    this.horarioOptions = horariosDisponiveisFormatados;
  }

  getEspecialidades() {
    this.especialidades.getData().subscribe({
      next: (response) => {
        this.especialidadesData = response.map((response) => ({
          id: response.id,
          name: response.specialtyName,
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  // gerarHorarioOptions(intervalo: number) {
  //   const horarioInicial = 9 * 60; // 09:00 em minutos
  //   const horarioFinal = 18 * 60; // 18:00 em minutos
  //   const horariosDisponiveis = [];

  //   for (
  //     let minutos = horarioInicial;
  //     minutos < horarioFinal;
  //     minutos += intervalo
  //   ) {
  //     const horas = Math.floor(minutos / 60);
  //     const min = minutos % 60;
  //     const horario = `${String(horas).padStart(2, '0')}:${String(min).padStart(
  //       2,
  //       '0'
  //     )}`;

  //     // Adiciona apenas os horários que não estão indisponíveis
  //     if (!this.horariosIndisponiveis.includes(horario)) {
  //       horariosDisponiveis.push({ value: horario, name: horario });
  //     }
  //   }

  //   this.horarioOptions = horariosDisponiveis;
  // }

  voltar() {
    this.router.navigate(['/pacientes/listagem']);
  }
  constructor(
    private especialidades: EspecialidadeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getEspecialidades();
  }
}
