import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],
})
export class CabecalhoComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // opcional, para uma rolagem suave
    });
  }
  getNome(): string {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Access and log the name property
    const userName = userInfo ? userInfo.name : null;

    return userName;
  }

  getCargo(): string {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Access and log the name property
    const userName = userInfo ? userInfo.userType.name : null;

    return userName;
  }

  logout() {
    this.router.navigate(['login']);
    localStorage.clear();
  }
}
