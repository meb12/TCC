import { Component, OnInit } from '@angular/core';
import { CepService } from '../../../../core/services/cep.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { TiposUsuariosService } from '../../../../core/services/user-types.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';
import { NgForm } from '@angular/forms';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';

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
  acao: string = '';
  tipoAcao = '';
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
    stateName: '',
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
    private medicosService: MedicosService,
    private funcionariosService: FuncionariosService
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
    this.form.stateName = '';
  }

  validateRouteOnLoad() {
    const urlSegments = this.router.url.split('/');
    if (urlSegments.length > 2) {
      const tipoCadastroSegment = urlSegments[2].toLowerCase();
      this.tipoAcao = urlSegments[3];

      switch (tipoCadastroSegment) {
        case 'paciente':
          this.form.tipoCadastro = 1;
          this.form.userType = '';
          this.getUserTypes('Paciente');
          this.form.tipoCadastroLabel = 'Paciente';
          break;
        case 'medico':
          this.form.tipoCadastro = 2;
          this.inicializarFormulario();
          this.form.userType = '';
          this.getUserTypes('Médico');
          this.form.tipoCadastroLabel = 'Médico';
          break;
        case 'funcionario':
          this.form.tipoCadastro = 3;
          this.inicializarFormulario();
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
        this.form.stateName = data.uf;
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
      if (!this.tipoAcao) {
        const FormNovo = {
          cpf: this.form.cpf,
          documentNumber: this.form.documentNumber,
          name: this.form.name,
          dateOfBirth: this.formatarDataBack(this.form.dateOfBirth),
          email: this.form.email,
          cellphone: this.form.cellphone,
          userTypeId: this.form.userType,
          streetName: this.form.streetName,
          streetNumber: this.form.streetNumber,
          complement: this.form.complement,
          neighborhood: this.form.neighborhood,
          state: this.form.stateName,
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
      } else if (this.tipoAcao) {
        const FormNovo = {
          id: parseInt(this.tipoAcao, 10),
          cpf: this.form.cpf,
          documentNumber: this.form.documentNumber,
          name: this.form.name,
          dateOfBirth: this.formatarDataBack(this.form.dateOfBirth),
          email: this.form.email,
          cellphone: this.form.cellphone,
          userTypeId: this.form.userType,
          streetName: this.form.streetName,
          streetNumber: this.form.streetNumber,
          complement: this.form.complement,
          neighborhood: this.form.neighborhood,
          state: this.form.stateName,
          cep: this.form.cep,
          city: this.form.city,
          gender: this.form.gender,
          isActive: this.form.isActive,
          doctorData: {
            crm: this.form.crm,
            specialtyTypeId: this.form.specialtyTypeId,
            observation: this.form.observation,
          },
        };
        this.medicosService.putData(FormNovo).subscribe({
          next: (response) => {
            this.toastr.success('Médico editado com sucesso!');
            this.router.navigateByUrl('/home');
          },
          error: (error) => {
            this.toastr.error('Erro ao cadastrar médico. Tente novamente.');
          },
        });
      }
    }
    if (this.form.tipoCadastro == 3) {
      if (!this.tipoAcao) {
        const FormNovo = {
          cpf: this.form.cpf,
          documentNumber: this.form.documentNumber,
          name: this.form.name,
          dateOfBirth: this.formatarDataBack(this.form.dateOfBirth),
          email: this.form.email,
          cellphone: this.form.cellphone,
          userTypeId: this.form.userType,
          streetName: this.form.streetName,
          streetNumber: this.form.streetNumber,
          complement: this.form.complement,
          neighborhood: this.form.neighborhood,
          state: this.form.stateName,
          cep: this.form.cep,
          city: this.form.city,
          gender: this.form.gender,
          isActive: true,
          login: this.form.email,
        };
        this.funcionariosService.postData(FormNovo).subscribe({
          next: (response) => {
            this.toastr.success('Funcionário cadastrado com sucesso!');
            this.router.navigateByUrl('/home');
          },
          error: (error) => {
            this.toastr.error(
              'Erro ao cadastrar funcionário. Tente novamente.'
            );
          },
        });
      } else if (this.tipoAcao) {
        const FormNovo = {
          id: parseInt(this.tipoAcao, 10),
          cpf: this.form.cpf,
          documentNumber: this.form.documentNumber,
          name: this.form.name,
          dateOfBirth: this.formatarDataBack(this.form.dateOfBirth),
          email: this.form.email,
          cellphone: this.form.cellphone,
          userTypeId: this.form.userType,
          streetName: this.form.streetName,
          streetNumber: this.form.streetNumber,
          complement: this.form.complement,
          neighborhood: this.form.neighborhood,
          state: this.form.stateName,
          cep: this.form.cep,
          city: this.form.city,
          gender: this.form.gender,
          isActive: this.form.isActive,
          login: this.form.email,
        };
        this.funcionariosService.putData(FormNovo).subscribe({
          next: (response) => {
            this.toastr.success('Funcionário editado com sucesso!');
            this.router.navigateByUrl('/home');
          },
          error: (error) => {
            this.toastr.error('Erro ao editar funcionário. Tente novamente.');
          },
        });
      }
    }
  }

  handleCancel() {
    this.router.navigateByUrl('/home');
  }

  formatarData(date1: any) {
    const date = new Date(date1);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  formatarDataBack(inputDate: string): string {
    const ddmmyyyyPattern = /^\d{2}-\d{2}-\d{4}$/; // Exemplo: 12-02-2003
    const yyyymmddPattern = /^\d{4}-\d{2}-\d{2}$/; // Exemplo: 2003-02-12
    const ddmmyyyyNoSeparatorPattern = /^\d{8}$/; // Exemplo: 12022003

    if (ddmmyyyyPattern.test(inputDate)) {
      // Se a data estiver no formato DD-MM-YYYY, converter para YYYY-MM-DDT00:00
      const [day, month, year] = inputDate.split('-');
      return `${year}-${month}-${day}T00:00`;
    } else if (yyyymmddPattern.test(inputDate)) {
      // Se a data estiver no formato YYYY-MM-DD, adicionar T00:00
      return `${inputDate}T00:00`;
    } else if (ddmmyyyyNoSeparatorPattern.test(inputDate)) {
      // Se a data estiver no formato DDMMYYYY sem separadores, converter para YYYY-MM-DDT00:00
      const day = inputDate.slice(0, 2);
      const month = inputDate.slice(2, 4);
      const year = inputDate.slice(4, 8);
      return `${year}-${month}-${day}T00:00`;
    } else {
      // Se a data já estiver no formato correto ou em outro formato, retornar como está
      return 'aaa';
    }
  }
  inicializarFormulario() {
    if (this.form.tipoCadastro == 2 && this.tipoAcao) {
      this.medicosService.getDataId(this.tipoAcao).subscribe({
        next: (response) => {
          this.form = {
            name: response.name,
            dateOfBirth: this.formatarData(response.dateOfBirth),
            cpf: response.cpf,
            documentNumber: response.documentNumber,
            cellphone: response.cellphone,
            email: response.email,
            cep: response.cep,
            streetName: response.streetName,
            streetNumber: response.streetNumber,
            neighborhood: response.neighborhood,
            city: response.city,
            stateName: response.stateName,
            specialtyTypeId: response.doctorData.specialtyType.id,
            crm: response.doctorData.crm,
            observation: response.doctorData.observation,
            userType: response.userTypeId,
            complement: response.complement,
            specialtyType: response.doctorData.specialtyType.id,
            gender: response.gender,
            tipoCadastro: 2,
            tipoCadastroLabel: 'Médico',
            isActive: response.isActive,
          };
        },
        error: (error) => {
          console.error('Erro ao carregar especialidades:', error);
        },
      });
    } else if (this.form.tipoCadastro == 3 && this.tipoAcao) {
      this.funcionariosService.getDataId(this.tipoAcao).subscribe({
        next: (response) => {
          this.form = {
            name: response.name,
            dateOfBirth: this.formatarData(response.dateOfBirth),
            cpf: response.cpf,
            documentNumber: response.documentNumber,
            cellphone: response.cellphone,
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
          };
        },
        error: (error) => {
          console.error('Erro ao carregar especialidades:', error);
        },
      });
    }
  }

  isFormValid: boolean = true;

  onChildValidityChange(isValid: boolean) {
    this.isFormValid = isValid; // Atualiza o estado do formulário com base na validade do campo filho
  }

  // Função de validação do formulário
  validaForm(): boolean {
    var requiredFields = [];
    // Verifica se os campos obrigatórios estão preenchidos
    if (this.form.tipoCadastro == 1 || this.form.tipoCadastro == 3) {
      requiredFields = [
        'name',
        'dateOfBirth',
        'cpf',
        'documentNumber',
        'cellphone',
        'email',
        'cep',
        'streetName',
        'streetNumber',
        'neighborhood',
        'city',
        'stateName',
        'gender',
      ];
    }
    if (this.form.tipoCadastro == 2) {
      requiredFields = [
        'name',
        'dateOfBirth',
        'cpf',
        'documentNumber',
        'cellphone',
        'email',
        'cep',
        'streetName',
        'streetNumber',
        'neighborhood',
        'city',
        'stateName',
        'specialtyTypeId',
        'crm',
        'gender',
      ];
    }

    // Verifica se algum campo obrigatório está vazio
    const hasEmptyFields = requiredFields.some((field) => !this.form[field]);
    if (hasEmptyFields) {
      return true; // Inválido se houver campos obrigatórios vazios
    }

    if (!this.validaCpf(this.form.cpf)) {
      return true; // Inválido se o CPF não for válido
    }

    if (!this.validaEmail(this.form.email)) {
      return true; // Inválido se o e-mail não for válido
    }

    if (!/^\d{5}-?\d{3}$/.test(this.form.cep)) {
      return true; // Inválido se o CEP não for válido
    }
    if (!this.validaDataNascimento(this.form.dateOfBirth)) {
      return true; // Inválido se a data de nascimento for inválida ou futura
    }

    // Caso todas as validações passem, o formulário é válido
    return false;
  }

  validaDataNascimento(dateOfBirth: string): boolean {
    let birthDate: Date;

    // Verifica se a data está no formato DDMMYYYY
    if (dateOfBirth.length === 8 && /^\d{8}$/.test(dateOfBirth)) {
      const day = parseInt(dateOfBirth.substring(0, 2), 10);
      const month = parseInt(dateOfBirth.substring(2, 4), 10) - 1;
      const year = parseInt(dateOfBirth.substring(4, 8), 10);
      birthDate = new Date(year, month, day);
    }
    // Verifica se a data está no formato DD-MM-YYYY
    else if (/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      const [day, month, year] = dateOfBirth.split('-').map(Number);
      birthDate = new Date(year, month - 1, day);
    } else {
      return false; // Formato inválido
    }

    const currentDate = new Date();

    // Verifica se a data é inválida ou futura
    if (
      birthDate.getFullYear() !== (birthDate.getFullYear() || 0) ||
      birthDate.getMonth() !== (birthDate.getMonth() || 0) ||
      birthDate.getDate() !== (birthDate.getDate() || 0) ||
      birthDate >= currentDate
    ) {
      return false;
    }

    return true;
  }

  validaCpf(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se o CPF tem 11 dígitos e se não é uma sequência de números iguais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    // CPF válido
    return true;
  }

  // Exemplo de função para validar e-mail
  validaEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }
}
