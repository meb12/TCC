import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MedicosService } from '../../../../core/services/medicos.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { ConsultasService } from './../../../../core/services/consultas.service';

@Component({
  selector: 'app-calendario-medico',
  templateUrl: './calendario-medico.component.html',
  styleUrls: ['./calendario-medico.component.css'],
})
export class CalendarioMedicoComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('dateSelector') dateSelector!: ElementRef;

  idMedico: any;
  doctors = [];
  appointments = [];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  selectedDate: any;
  displayedAppointments: any;

  months = [
    'JANEIRO',
    'FEVEREIRO',
    'MARÇO',
    'ABRIL',
    'MAIO',
    'JUNHO',
    'JULHO',
    'AGOSTO',
    'SETEMBRO',
    'OUTUBRO',
    'NOVEMBRO',
    'DEZEMBRO',
  ];

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locales: allLocales,
    locale: 'pt-br',
    headerToolbar: { left: '', center: 'title', right: '' },
    dayMaxEventRows: true,
    events: [],
    eventContent: (arg) => this.customEventContent(arg),
    dateClick: this.handleDateClick.bind(this),
    showNonCurrentDates: false,
    fixedWeekCount: false,
    titleFormat: { year: 'numeric', month: 'long' },
  };

  monthOptions = this.months.map((month, index) => ({
    label: month,
    value: index + 1,
  }));

  yearOptions = [2023, 2024, 2025].map((year) => ({
    label: year,
    value: year,
  }));

  graphPacientesCadastradas: any = {
    title: 'Pacientes ativos',
    description: 'Quantidade',
    descriptionValue: '',
    totalValue: '',
  };

  graphMedicosCadastrados: any = {
    title: 'Médicos ativos',
    description: 'Quantidade',
    descriptionValue: '',
    totalValue: '',
  };

  graphFuncionariosCadastrados: any = {
    title: 'Funcionários ativos',
    description: 'Quantidade',
    descriptionValue: '',
    totalValue: '',
  };

  mockedGraphsData = [
    this.graphPacientesCadastradas,
    this.graphMedicosCadastrados,
    this.graphFuncionariosCadastrados,
  ];

  constructor(
    private medicos: MedicosService,
    private funcionarios: FuncionariosService,
    private pacientes: PacientesService,
    private consultas: ConsultasService
  ) {
    registerLocaleData(localePt);
  }

  ngOnInit(): void {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      this.idMedico = JSON.parse(userInfoString);
    }
    this.getAppointments(); // Carrega as consultas

    // Filtra as consultas para o dia atual
    this.filterAppointmentsByToday();

    this.updateAspectRatio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getAppointments() {
    this.consultas.getConsultaMedico(this.idMedico.id).subscribe({
      next: (response: any) => {
        // Mapeia consultas normais e de retorno
        this.appointments = response.flatMap((appointment) => {
          const mainAppointment = {
            title: 'Consulta',
            date: new Date(appointment.appointmentDate)
              .toISOString()
              .split('T')[0],
            doctor: appointment.doctorData,
            patient: appointment.pacientData,
            hora: appointment.appointmentDate.split('T')[1].slice(0, 5),
          };

          const returnAppointments = appointment.appointmentsReturn.map(
            (returnAppt) => ({
              title: 'Retorno',
              date: new Date(returnAppt.appointmentDate)
                .toISOString()
                .split('T')[0],
              doctor: returnAppt.doctorData,
              patient: appointment.pacientData,
              hora: returnAppt.appointmentDate.split('T')[1].slice(0, 5),
            })
          );

          return [mainAppointment, ...returnAppointments];
        });

        // Mescla os eventos novos com os eventos existentes
        this.updateCalendarEvents();

        // Filtra as consultas para o dia atual
        this.filterAppointmentsByToday();
      },
      error: (error) => console.error('Erro ao carregar consultas:', error),
    });
  }

  updateCalendarEvents() {
    // Mescla os novos eventos com os antigos (não sobrescreve os anteriores)
    this.calendarOptions.events = [
      ...this.calendarOptions.events, // Mantém os eventos existentes
      ...this.consolidateEvents(this.appointments), // Adiciona os eventos novos
    ];

    // Atualiza o calendário
    if (this.calendarComponent) {
      this.calendarComponent.getApi().refetchEvents();
    }
  }

  getMedicos() {
    this.medicos.getData().subscribe({
      next: (response) => {
        const mappedDoctors = response
          .filter((medico: any) => medico.isActive === true)
          .map((medico: any) => ({
            id: medico.id,
            name: medico.name.split(' ')[0],
            gender: medico.gender,
            checked: false,
          }));

        this.graphMedicosCadastrados.descriptionValue = mappedDoctors.length;
        this.graphMedicosCadastrados.totalValue = mappedDoctors.length;

        this.doctors = mappedDoctors;
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
  }

  getPacientes() {
    this.pacientes.getData().subscribe({
      next: (response) => {
        this.graphPacientesCadastradas.descriptionValue = response.length;
        this.graphPacientesCadastradas.totalValue = response.length;
      },
      error: (error) => console.error('Erro ao carregar pacientes:', error),
    });
  }

  getFuncionario() {
    this.funcionarios.getData().subscribe({
      next: (response) => {
        this.graphFuncionariosCadastrados.descriptionValue = response.length;
        this.graphFuncionariosCadastrados.totalValue = response.length;
      },
      error: (error) => console.error('Erro ao carregar funcionários:', error),
    });
  }

  handleDateClick(arg) {
    this.selectedDate = arg.dateStr;
    const selectedDoctors = this.doctors
      .filter((doctor) => doctor.checked)
      .map((doctor) => doctor.id);

    this.displayedAppointments = this.appointments.filter(
      (appointment) =>
        appointment.date.includes(this.selectedDate) &&
        (selectedDoctors.length === 0 ||
          selectedDoctors.includes(appointment.doctor.id))
    );
    console.log(this.displayedAppointments);
  }

  filterAppointments() {
    this.displayedAppointments = [];
    const selectedDoctorIds = this.doctors
      .filter((doctor) => doctor.checked)
      .map((doctor) => doctor.id);

    const filteredAppointments = this.appointments.filter(
      (appointment) =>
        selectedDoctorIds.length === 0 ||
        selectedDoctorIds.includes(appointment.doctor.id)
    );

    this.calendarOptions.events = this.consolidateEvents(filteredAppointments);
    if (this.calendarComponent) {
      this.calendarComponent.getApi().refetchEvents();
    }
  }

  consolidateEvents(appointments) {
    const eventsByDay = {};

    appointments.forEach((appointment) => {
      const date = appointment.date;
      if (!eventsByDay[date]) {
        eventsByDay[date] = {
          start: date,
          count: 0,
          title: 'Consultas',
          icon: 'assets/img/icone-medicos.svg',
          details: [],
        };
      }
      eventsByDay[date].count++;
      eventsByDay[date].details.push({
        doctorName: appointment.doctor.name,
        doctorSpecialty: appointment.doctor.specialtyType.description,
        patientName: appointment.patient.name,
      });
    });

    return Object.values(eventsByDay);
  }

  customEventContent(arg) {
    const element = document.createElement('div');
    element.classList.add('custom-event');

    // Verifica se o evento é do dia atual
    const isToday =
      arg.event.start.toISOString().split('T')[0] ===
      new Date().toISOString().split('T')[0];
    if (isToday) {
      element.classList.add('today-event'); // Classe CSS para eventos de hoje
    }

    element.innerHTML = `
      <img src="${arg.event._def.extendedProps.icon}" alt="Icone Médico" style="display: flex; justify-content: center;width: 16px; height: 16px; margin-right: 4px;">
      <span>${arg.event._def.extendedProps.count} </span>
    `;
    return { domNodes: [element] };
  }

  updateCalendar() {
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.calendarComponent.getApi().gotoDate(selectedDate);
  }

  updateAspectRatio() {
    const calendarApi = this.calendarComponent?.getApi();
    if (calendarApi) {
      calendarApi.setOption('aspectRatio', this.getAspectRatio());
    }
  }

  getAspectRatio(): number {
    return window.innerWidth < 768 ? 1.35 : 1.75;
  }

  onMonthYearChange() {
    this.displayedAppointments = [];
    this.updateCalendar();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateAspectRatio();
  }

  ngAfterViewInit() {
    // Ajusta os estilos dos eventos do calendário
    this.adjustCalendarEventStyles();

    // Simula o clique no dia atual
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // Formata a data para YYYY-MM-DD

    // Verifica se a função dateClick está disponível e a chama manualmente
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      const dateClickHandler = this.calendarOptions.dateClick; // Obtém o manipulador de clique de data

      if (dateClickHandler) {
        // Chama a função de clique no dia atual
        dateClickHandler({ dateStr: todayDateString });
      }

      // Garante que o calendário vá para o mês correto (se não estiver no mês atual)
      calendarApi.gotoDate(today);

      // Adiciona uma pequena pausa para garantir que o evento seja processado
      setTimeout(() => {
        this.filterAppointmentsByToday(); // Filtra as consultas do dia atual
      }, 300);
    }

    // Movendo o selector de data
    const calendarToolbarRight = document.querySelector(
      '.fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:last-child'
    );
    if (calendarToolbarRight && this.dateSelector) {
      calendarToolbarRight.appendChild(this.dateSelector.nativeElement);
    }
  }

  filterAppointmentsByToday() {
    const today = new Date().toISOString().split('T')[0]; // Obtém a data no formato YYYY-MM-DD
    this.selectedDate = today; // Define a data selecionada como hoje

    // Filtra as consultas para o dia atual
    this.displayedAppointments = this.appointments.filter(
      (appointment) => appointment.date === today
    );

    // Consolida os eventos para o dia atual
    const todayEvents = this.consolidateEvents(this.displayedAppointments);

    // Remove os eventos duplicados do dia atual, caso já existam
    this.calendarOptions.events = this.calendarOptions.events.filter(
      (event: any) => event.start !== today // Remove eventos de hoje para não duplicar
    );

    // Mescla os eventos do dia atual com os eventos existentes
    this.calendarOptions.events = [
      ...this.calendarOptions.events, // Mantém os eventos de outros dias
      ...todayEvents, // Adiciona os eventos do dia atual
    ];

    // Atualiza o calendário
    if (this.calendarComponent) {
      this.calendarComponent.getApi().refetchEvents();
    }
  }

  adjustCalendarEventStyles() {
    setTimeout(() => {
      const eventHarnesses = document.querySelectorAll(
        '.fc-daygrid-event-harness'
      );
      eventHarnesses.forEach((el: HTMLElement) => {
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
      });
    }, 100);
  }
}
