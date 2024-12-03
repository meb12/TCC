import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tiposCalendario',
  templateUrl: './tiposCalendario.component.html',
  styleUrls: ['./tiposCalendario.component.css'],
})
export class TiposCalendarioComponent implements OnInit {
  userType: any;
  constructor() {}

  ngOnInit() {
    const storedUserType = localStorage.getItem('userInfo');
    if (storedUserType) {
      this.userType = JSON.parse(storedUserType);
    }
  }
}
