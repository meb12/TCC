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
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('dateSelector') dateSelector!: ElementRef;

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
    this.getAppointments();
    this.getMedicos();
    this.getPacientes();
    this.getFuncionario();
    this.updateAspectRatio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getAppointments() {
    this.consultas.getData().subscribe({
      next: (response: any) => {
        console.log(response);
        // Mapeia consultas normais e de retorno
        this.appointments = response.flatMap((appointment) => {
          // Define o título como "Consulta" para a consulta principal
          const mainAppointment = {
            title: 'Consulta',
            date: new Date(appointment.appointmentDate)
              .toISOString()
              .split('T')[0],
            doctor: appointment.doctorData,
            patient: appointment.pacientData,
            hora: appointment.appointmentDate.split('T')[1].slice(0, 5),
          };

          // Define o título como "Retorno" para cada consulta de retorno
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

          // Combina a consulta principal com as consultas de retorno
          return [mainAppointment, ...returnAppointments];
        });

        // Consolida e atualiza os eventos no calendário
        this.calendarOptions.events = this.consolidateEvents(this.appointments);
        if (this.calendarComponent) {
          this.calendarComponent.getApi().refetchEvents();
        }
      },
      error: (error) => console.error('Erro ao carregar consultas:', error),
    });
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
    element.innerHTML = `
        <img src="${arg.event._def.extendedProps.icon}" alt="Icone Médico" style="width: 16px; height: 16px; margin-right: 4px;">
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
    this.adjustCalendarEventStyles();
    const calendarToolbarRight = document.querySelector(
      '.fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:last-child'
    );
    if (calendarToolbarRight && this.dateSelector) {
      calendarToolbarRight.appendChild(this.dateSelector.nativeElement);
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
