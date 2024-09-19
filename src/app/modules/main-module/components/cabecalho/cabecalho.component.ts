import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],
})
export class CabecalhoComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}
  getNome(): string {
    const funcionario = localStorage.getItem('Funcionario');
    const funcionarioObj = funcionario
      ? JSON.parse(funcionario)
      : 'Dados não encontrados';

    return funcionarioObj.TxNomeFuncionario !== null
      ? funcionarioObj.TxNomeFuncionario.replace(/["]/g, '')
      : 'Usuário não encontrado';
  }

  getCargo(): string {
    const perfil = localStorage.getItem('Perfil');
    const perfilObj = perfil ? JSON.parse(perfil) : 'Dados não encontrados';

    return perfilObj.TxNomePerfil !== null
      ? perfilObj.TxNomePerfil.replace(/["]/g, '')
      : 'Perfil não encontrado';
  }

  logout() {
    this.router.navigate(['login']);
    localStorage.clear();
  }
}
