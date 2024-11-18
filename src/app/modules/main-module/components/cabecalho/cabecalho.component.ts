import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],
})
export class CabecalhoComponent implements OnInit {
  userPhoto: string = 'assets/img/perfil.svg';

  constructor(private router: Router) {}
  ngOnInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // opcional, para uma rolagem suave
    });

    const userInfo = localStorage.getItem('userInfo'); // Obtém o objeto userInfo
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo); // Converte a string JSON em objeto
      if (parsedUserInfo.foto) {
        this.userPhoto = `data:image/png;base64,${parsedUserInfo.foto}`; // Adiciona o prefixo
      }
    }
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
