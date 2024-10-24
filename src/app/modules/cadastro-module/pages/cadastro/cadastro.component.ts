import { Component, OnInit } from '@angular/core';
import { CepService } from '../../../../core/services/cep.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { TiposUsuariosService } from '../../../../core/services/user-types.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';

interface Country {
  name: { common: string; official: string };
  translations: { por?: { official: string; common: string } };
  cca3: string;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {
  newAllergy: string = '';
  allergies: string[] = [];
  opcoesSexo = [
    { value: 'Masculino', name: 'Masculino' },
    { value: 'Feminino', name: 'Feminino' },
    { value: 'Não Binário', name: 'Não Binário' },
    { value: 'Prefere não dizer', name: 'Prefere não dizer' },
  ];

  // Remova a definição de FormGroup
  form: any = {
    // Formulário como um objeto simples
    name: '',
    dateOfBirth: '',
    cpf: '',
    documentNumber: '',
    nacionality: '',
    cellphone: '',
    email: '',
    cep: '',
    streetName: '',
    streetNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    specialtyTypeId: '',
    crm: '',
    observation: '',
    tipoCadastro: '',
    tipoCadastroLabel: '',
    userType: '',
    complement: '',
    specialtyType: '',
    allergyInput: '',
    gender: '',
    allergies: [],
  };

  tipoCadastro: string = '';
  especialidadesData: any[] = [];
  cadastroOptions = [];

  constructor(
    private cepService: CepService,
    private router: Router,
    private http: HttpClient,
    private especialidades: EspecialidadeService,
    private tiposUsuarios: TiposUsuariosService,
    private toastr: ToastrService,
    private medicosService: MedicosService
  ) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.setupRouteListener();
    this.validateRouteOnLoad();
    this.getEspecialidades();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onCepChange(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      this.getCepData(cleanCep);
    } else {
      this.getCepData(cleanCep);
      this.clearAddressFields();
    }
  }

  addAllergy() {
    if (this.newAllergy.trim()) {
      this.form.allergies.push(this.newAllergy.trim()); // Adiciona no array de alergias do form
      this.newAllergy = ''; // Limpa o campo de entrada após adicionar
    }
  }

  // Remove uma alergia pelo índice
  removeAllergy(index: number) {
    this.form.allergies.splice(index, 1); // Remove do array de alergias do form
  }

  private clearAddressFields() {
    this.form.streetName = '';
    this.form.neighborhood = '';
    this.form.city = ''; // Ensure this is the correct property name
    this.form.state = '';
  }

  validateRouteOnLoad() {
    const urlSegments = this.router.url.split('/');
    if (urlSegments.length > 2) {
      const tipoCadastroSegment = urlSegments[2].toLowerCase();
      switch (tipoCadastroSegment) {
        case 'paciente':
          this.form.tipoCadastro = 1;
          this.form.userType = '';
          this.getUserTypes('Paciente');
          this.form.tipoCadastroLabel = 'Paciente';
          break;
        case 'medico':
          this.form.tipoCadastro = 2;
          this.form.userType = '';
          this.getUserTypes('Médico');
          this.form.tipoCadastroLabel = 'Médico';
          break;
        case 'funcionario':
          this.form.tipoCadastro = 3;
          this.form.userType = '';
          this.form.tipoCadastroLabel = '';
          this.getUserTypes();
          break;
        default:
          this.form.tipoCadastro = '';
          this.form.tipoCadastroLabel = '';
      }
    }
  }

  getLabel(): string {
    switch (this.form.tipoCadastro) {
      case 1:
        return 'Nome do Paciente';
      case 2:
        return 'Nome do Médico';
      case 3:
        return 'Nome do Funcionário';
      default:
        return 'Nome';
    }
  }

  setupRouteListener() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
        this.validateRouteOnLoad();
      });
  }

  getCepData(cep: string) {
    this.cepService.getAddressByCep(cep).subscribe((data) => {
      if (!data.erro) {
        this.form.streetName = data.logradouro;
        this.form.neighborhood = data.bairro;
        this.form.city = data.localidade;
        this.form.state = data.uf;
      } else {
        console.error('CEP não encontrado');
      }
    });
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

  getUserTypes(pesquisa?: string) {
    this.tiposUsuarios.getUserTypes().subscribe({
      next: (response) => {
        if (this.form.tipoCadastro === 3) {
          this.cadastroOptions = response.filter(
            (option) => option.name !== 'Médico' && option.name !== 'Paciente'
          );
        } else {
          const item = response.find((item) => item.name === pesquisa);
          if (item) {
            this.form.userType = item.id;
          }
        }
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  handleConfirm() {
    if (this.form.tipoCadastro == 2) {
      const FormNovo = {
        cpf: this.form.cpf,
        documentNumber: this.form.documentNumber,
        name: this.form.name,
        dateOfBirth: this.form.dateOfBirth,
        email: this.form.email,
        cellphone: this.form.cellphone,
        userTypeId: 1,
        streetName: this.form.streetName,
        streetNumber: this.form.streetNumber,
        complement: this.form.complement,
        neighborhood: this.form.neighborhood,
        state: this.form.state,
        cep: this.form.cep,
        city: this.form.city,
        gender: this.form.gender,
        isActive: true,
        doctorData: {
          crm: this.form.crm,
          specialtyTypeId: this.form.specialtyTypeId,
          observation: this.form.observation,
        },
      };
      this.medicosService.postData(FormNovo).subscribe({
        next: (response) => {
          this.toastr.success('Médico cadastrado com sucesso!');
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          this.toastr.error('Erro ao cadastrar médico. Tente novamente.');
        },
      });
    }
  }

  handleCancel() {
    this.router.navigateByUrl('/home');
  }
}
