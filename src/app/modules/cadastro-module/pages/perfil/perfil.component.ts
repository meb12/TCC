import { Component, OnInit } from '@angular/core';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  userPhoto: string = 'assets/img/perfil.svg';
  data;
  userId: string | null = null;
  constructor(
    private usuario: FuncionariosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const userInfo = localStorage.getItem('userInfo'); // Obtém o objeto userInfo
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo); // Converte a string JSON em objeto
      if (parsedUserInfo.foto) {
        this.userPhoto = `data:image/png;base64,${parsedUserInfo.foto}`; // Adiciona o prefixo
      }
    }
    this.userId = this.route.snapshot.paramMap.get('id');

    this.getUser();
  }

  getUser() {
    this.usuario.getDataId(this.userId).subscribe({
      next: (response) => {
        this.data = {
          name: response.name,
          cpf: response.cpf,
          documentNumber: response.documentNumber,
          cellphone: this.formatPhoneNumber(response.cellphone),
          email: response.email,
          cep: response.cep,
          streetName: response.streetName,
          streetNumber: response.streetNumber,
          neighborhood: response.neighborhood,
          city: response.city,
          stateName: response.stateName,
          userType: response.userType.id,
          complement: response.complement,
          gender: response.gender,
          tipoCadastro: 3,
          tipoCadastroLabel: '',
          isActive: response.isActive,
          allergies: response.allergies || [],
          address: this.formatAddress(
            response.streetName,
            response.streetNumber,
            response.neighborhood,
            response.city,
            response.stateName
          ),
        };
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  formatAddress(
    streetName: string,
    streetNumber: string,
    neighborhood: string,
    city: string,
    stateName: string
  ): string {
    return `${streetName}, ${streetNumber} - ${neighborhood} - ${city} - ${stateName}`;
  }
}
