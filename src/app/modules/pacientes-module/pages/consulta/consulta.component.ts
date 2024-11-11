import { Component, Input, OnInit } from '@angular/core';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicosService } from '../../../../core/services/medicos.service';
import { PacientesService } from '../../../../core/services/pacientes.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  data;

  id: number;

  form: any = {
    especialidades: '',
    medico: '',
    date: '',
    horario: '',
    observacao: 0,
  };

  medicosOptions = [];

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
  getPaciente() {
    console.log('chegando', this.id);
    this.pacientes.getDataId(this.id).subscribe({
      next: (response) => {
        this.data = response;
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
    private pacientes: PacientesService,
    private router: Router,
    private medicos: MedicosService,
    private route: ActivatedRoute
  ) {}

  getMedicos() {
    this.medicos.getData().subscribe({
      next: (response) => {
        // Mapeia a resposta da API para o formato esperado
        this.medicosOptions = response.map((medico: any) => ({
          value: medico.id, // O ID do médico será usado como "value"
          name: medico.name, // Título conforme o gênero
          especialidadeId: medico.doctorData.specialtyType.id, // ID da especialidade
          especialidade: medico.doctorData.specialtyType.specialtyName, // Nome da especialidade
          intervaloConsulta:
            medico.doctorData.specialtyType.intervalBetweenAppointments, // Intervalo entre consultas
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
  }
  formatarValor(tipo: string, valor: string): string {
    switch (tipo) {
      case 'data':
        const [date] = valor.split('T');
        const [ano, mes, dia] = date.split('-');
        return `${dia}/${mes}/${ano}`;

      case 'telefone':
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      case 'cpf':
        return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

      case 'rg':
        return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');

      default:
        return '';
    }
  }
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID da URL:', this.id);
    this.getEspecialidades();
    this.getMedicos();
    this.getPaciente();
  }
}
