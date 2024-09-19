import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-novo-compoente',
  templateUrl: './novo-compoente.component.html',
  styleUrls: ['./novo-compoente.component.css'],
})
export class NovoCompoenteComponent implements OnInit {
  doctorAppointments = [
    {
      time: '10:30 - 12:30',
      doctors: [
        {
          name: 'Dra. Camila Taglione',
          specialty: 'Dermatologista',
          consultations: 5,
        },
        {
          name: 'Dr. Luis Barletta',
          specialty: 'Psiquiatra',
          consultations: 2,
        },
        {
          name: 'Dr. Juan Mendes',
          specialty: 'Cardiologista',
          consultations: 4,
        },
        {
          name: 'Dra. Brunna Paulino',
          specialty: 'Pediatra',
          consultations: 6,
        },
      ],
    },
    {
      time: '13:30 - 15:30',
      doctors: [
        {
          name: 'Dra. Yasmin Santos',
          specialty: 'Neurologista',
          consultations: 2,
        },
        {
          name: 'Dr. Hugo Pinto',
          specialty: 'Oftamologista',
          consultations: 8,
        },
        {
          name: 'Dr. Juan Mendes',
          specialty: 'Cardiologista',
          consultations: 3,
        },
        {
          name: 'Dra. Maria Eduarda',
          specialty: 'Medicina do Trabalho',
          consultations: 7,
        },
      ],
    },
    // Adicione mais horários e médicos conforme necessário
  ];
  constructor() {}

  ngOnInit() {
    console.log('carregou cs');
  }
}
