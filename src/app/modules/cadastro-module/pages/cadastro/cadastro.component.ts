import { Component, OnInit } from '@angular/core';
import { CepService } from '../../../../core/services/cep.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { TiposUsuariosService } from '../../../../core/services/user-types.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { PacientesService } from '../../../../core/services/pacientes.service';
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
  userTypesData: any[] = [];
  acao: string = '';
  tipoAcao = '';
  opcoesSexo = [
    { value: 'Masculino', name: 'Masculino' },
    { value: 'Feminino', name: 'Feminino' },
    { value: 'Não Binário', name: 'Não Binário' },
    { value: 'Prefere não dizer', name: 'Prefere não dizer' },
  ];
  base64Image: string | null = null;
  imageSrc: string = 'assets/img/image-avatar.svg';
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
  isFormValid: boolean = true;

  constructor(
    private cepService: CepService,
    private router: Router,
    private http: HttpClient,
    private especialidades: EspecialidadeService,
    private tiposUsuarios: TiposUsuariosService,
    private toastr: ToastrService,
    private pacienteService: PacientesService,
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
      this.form.allergies.push({
        allergy: this.newAllergy.trim(),
        isEditing: false, // Adiciona a propriedade isEditing como false por padrão
      });
      this.newAllergy = ''; // Limpa o campo de entrada após adicionar
    } else {
      this.toastr.error('É necessário digitar uma alergia.');
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
          this.inicializarFormulario();
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
          name: response.description,
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  getUserTypes(pesquisa?: string) {
    if (this.userTypesData.length > 0) {
      this.filtrarUserTypes(pesquisa);
      return;
    }

    this.tiposUsuarios.getUserTypes().subscribe({
      next: (response) => {
        this.userTypesData = response;
        this.filtrarUserTypes(pesquisa);
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de usuário:', error);
      },
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  filtrarUserTypes(pesquisa?: string) {
    if (this.form.tipoCadastro === 3) {
      this.cadastroOptions = this.userTypesData.filter(
        (option) => option.name !== 'Médico' && option.name !== 'Paciente'
      );
    } else {
      const item = this.userTypesData.find((item) => item.name === pesquisa);
      if (item) {
        this.form.userType = item.id;
      }
    }
  }

  handleConfirm() {
    if (this.form.tipoCadastro == 1) {
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
          pacientData: {
            allergies: this.form.allergies,
          },
        };

        if (this.hasPhoto()) {
          this.pacienteService.postData(FormNovo).subscribe({
            next: (response) => {
              this.enviarFoto(
                response.id,
                'Paciente cadastrado com sucesso!',
                'paciente'
              );
            },
            error: (error) => {
              this.toastr.error('Erro ao cadastrar paciente. Tente novamente.');
            },
          });
        }
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
          pacientData: {
            allergies: this.form.allergies,
          },
        };

        if (this.hasPhoto()) {
          this.pacienteService.putData(FormNovo).subscribe({
            next: (response) => {
              this.enviarFoto(
                response.id,
                'Paciente editado com sucesso!',
                'paciente'
              );
            },
            error: (error) => {
              this.toastr.error('Erro ao editar paciete. Tente novamente.');
            },
          });
        }
      }
    }
    if (this.form.tipoCadastro == 2) {
      if (!this.tipoAcao) {
        const FormNovo = {
          cpf: this.form.cpf,
          documentNumber: this.form.documentNumber,
          name: this.form.name,
          dateOfBirth: this.formatarDataBack(this.form.dateOfBirth),
          email: this.form.email,
          login: this.form.email,
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
        if (this.hasPhoto()) {
          this.medicosService.postData(FormNovo).subscribe({
            next: (response) => {
              this.enviarFoto(
                response.id,
                'Médico cadastrado com sucesso!',
                'medico'
              );
            },
            error: (error) => {
              this.toastr.error('Erro ao cadastrar médico. Tente novamente.');
            },
          });
        }
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
        if (this.hasPhoto()) {
          this.medicosService.putData(FormNovo).subscribe({
            next: (response) => {
              this.enviarFoto(
                response.id,
                'Médico editado com sucesso!',
                'medico'
              );
            },
            error: (error) => {
              this.toastr.error('Erro ao cadastrar médico. Tente novamente.');
            },
          });
        }
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
        if (this.hasPhoto()) {
          this.funcionariosService.postData(FormNovo).subscribe({
            next: (response) => {
              this.enviarFoto(
                response.id,
                'Funcionário cadastrado com sucesso!',
                'funcionario'
              );
            },
            error: (error) => {
              this.toastr.error(
                'Erro ao cadastrar funcionário. Tente novamente.'
              );
            },
          });
        }
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
        if (this.hasPhoto()) {
          this.funcionariosService.putData(FormNovo).subscribe({
            next: (response) => {
              this.enviarFoto(
                response.id,
                'Funcionário editado com sucesso!',
                'funcionario'
              );
            },
            error: (error) => {
              this.toastr.error('Erro ao editar funcionário. Tente novamente.');
            },
          });
        }
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
      return inputDate;
    }
  }

  inicializarFormulario() {
    if (this.form.tipoCadastro == 1 && this.tipoAcao) {
      this.pacienteService.getDataId(this.tipoAcao).subscribe({
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
            tipoCadastro: 1,
            tipoCadastroLabel: 'Paciente',
            isActive: response.isActive,
            allergies: response.pacientData.allergies || [],
          };
          if (response.photo) {
            this.exibirFotoBase64(response.photo);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar especialidades:', error);
        },
      });
    } else if (this.form.tipoCadastro == 2 && this.tipoAcao) {
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
            pacientData: {
              allergies: response.pacientData?.allergies || [],
            },
          };

          if (response.photo) {
            this.exibirFotoBase64(response.photo);
          }
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
            allergies: response.allergies || [],
          };
          if (response.photo) {
            this.exibirFotoBase64(response.photo);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar especialidades:', error);
        },
      });
    }
  }

  onChildValidityChange(isValid: boolean) {
    this.isFormValid = isValid;
  }

  validaForm(): boolean {
    let requiredFields = [];
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
        'observation',
      ];
    }

    const hasEmptyFields = requiredFields.some((field) => !this.form[field]);
    if (hasEmptyFields) {
      return true;
    }

    if (!this.validaCpf(this.form.cpf)) {
      return true;
    }

    if (!this.validaEmail(this.form.email)) {
      return true;
    }

    if (!/^\d{5}-?\d{3}$/.test(this.form.cep)) {
      return true;
    }
    if (!this.validaDataNascimento(this.form.dateOfBirth)) {
      return true;
    }

    return false;
  }

  validaDataNascimento(dateOfBirth: string): boolean {
    let birthDate: Date;
    if (dateOfBirth.length === 8 && /^\d{8}$/.test(dateOfBirth)) {
      const day = parseInt(dateOfBirth.substring(0, 2), 10);
      const month = parseInt(dateOfBirth.substring(2, 4), 10) - 1;
      const year = parseInt(dateOfBirth.substring(4, 8), 10);
      birthDate = new Date(year, month, day);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      const [day, month, year] = dateOfBirth.split('-').map(Number);
      birthDate = new Date(year, month - 1, day);
    } else {
      return false;
    }
    const currentDate = new Date();

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
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    return true;
  }

  validaEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }

  editAllergy(index: number) {
    this.form.allergies[index].isEditing = true;
  }

  saveAllergy(index: number) {
    this.form.allergies[index].isEditing = false;
  }

  onEditAllergy(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.allergies[index].allergy = input.value;
  }

  enviarFoto(id: any, mensagem: string, tipo: string): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const formData = new FormData();

    // Verifica se o arquivo foi selecionado
    if (fileInput?.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Nome do campo deve ser "photo", conforme esperado pelo backend
      formData.append('photo', file);
      formData.append('id', id.toString()); // ID adicionado ao `FormData` conforme necessário

      // Verifica o conteúdo do FormData antes do envio (debug)
      console.log('FormData antes do envio:', formData.get('photo'));

      // Envia o FormData para o backend
      this.funcionariosService.putFoto(id, formData).subscribe({
        next: (response) => {
          this.toastr.success(mensagem);
          if (tipo == 'medico') {
            this.router.navigateByUrl('/medicos/listagem');
          }

          if (tipo == 'funcionario') {
            this.router.navigateByUrl('/funcionarios/listagem');
          }

          if (tipo == 'paciente') {
            this.router.navigateByUrl('/pacientes/listagem');
          }
        },
        error: (error) => {
          this.toastr.error('Erro ao atualizar a foto. Tente novamente.');
        },
      });
    } else {
      this.toastr.error('Nenhuma foto selecionada.');
    }
  }

  base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      byteArrays.push(byteCharacters.charCodeAt(offset));
    }
    return new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });
  }

  hasPhoto(): boolean {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const previewImage = document.getElementById(
      'previewImage'
    ) as HTMLImageElement;

    // Verifica se há arquivos selecionados no input de arquivo
    const hasFile = fileInput?.files?.length > 0;

    // Verifica se há uma imagem na pré-visualização que não seja o avatar padrão
    const imageSrc = previewImage?.getAttribute('src');
    const hasValidPreview =
      imageSrc && imageSrc !== 'assets/img/image-avatar.svg';

    // Se nenhuma foto válida for encontrada
    if (!hasFile && !hasValidPreview) {
      this.toastr.error('Nenhuma foto selecionada');
      return false;
    }

    // Retorna true se houver um arquivo ou uma pré-visualização válida
    return true;
  }

  exibirFotoBase64(base64Image: string) {
    let mimePrefix = '';

    // Tentativa de detecção de tipo MIME com base em características conhecidas do Base64
    if (base64Image.trim().startsWith('/9j/')) {
      mimePrefix = 'data:image/jpeg;base64,'; // JPEG
    } else if (base64Image.trim().startsWith('iVBORw0KGgo=')) {
      mimePrefix = 'data:image/png;base64,'; // PNG
    } else if (base64Image.trim().startsWith('R0lGOD')) {
      mimePrefix = 'data:image/gif;base64,'; // GIF
    } else if (
      base64Image.trim().startsWith('PHN') ||
      base64Image.trim().includes('<svg')
    ) {
      mimePrefix = 'data:image/svg+xml;base64,'; // SVG
    } else {
      // Caso não possamos detectar o tipo, assumimos JPEG por padrão
      mimePrefix = 'data:image/jpeg;base64,';
    }

    // Adiciona o prefixo MIME à string base64
    this.base64Image = `${mimePrefix}${base64Image}`;

    // Obtendo a referência ao preview da imagem
    const previewImage = document.getElementById(
      'previewImage'
    ) as HTMLImageElement;
    const uploadText = document.getElementById('uploadText') as HTMLSpanElement;

    // Verifica se o elemento da imagem existe antes de tentar definir o src
    if (previewImage) {
      previewImage.src = this.base64Image;
      previewImage.style.display = 'block'; // Garante que a imagem estará visível

      if (uploadText) {
        uploadText.style.display = 'none'; // Esconde o texto "Adicionar Foto"
      }

      // Para depuração: verifica o caminho da imagem
      console.log('Preview Image SRC:', previewImage.src);
    } else {
      console.error('Elemento da imagem não encontrado!');
    }

    // Atualiza o campo de input com um "arquivo fictício" criado a partir do Base64
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      try {
        const byteString = atob(this.base64Image.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        let blob: Blob;
        if (this.base64Image.startsWith('data:image/svg+xml')) {
          blob = new Blob([ab], { type: 'image/svg+xml' });
        } else if (this.base64Image.startsWith('data:image/png')) {
          blob = new Blob([ab], { type: 'image/png' });
        } else if (this.base64Image.startsWith('data:image/jpeg')) {
          blob = new Blob([ab], { type: 'image/jpeg' });
        } else if (this.base64Image.startsWith('data:image/gif')) {
          blob = new Blob([ab], { type: 'image/gif' });
        } else {
          // Caso não seja nenhum dos formatos conhecidos, assumimos JPEG como padrão
          blob = new Blob([ab], { type: 'image/jpeg' });
        }

        const file = new File([blob], 'imagem_generica', { type: blob.type });

        // Atualizar o arquivo do input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
      } catch (error) {
        console.error('Erro ao converter base64 para Blob:', error);
      }
    } else {
      console.error('Input de arquivo não encontrado!');
    }
  }

  onFileSelected(event: Event | string): void {
    let file: File | null = null;

    if (typeof event === 'string') {
      // Se for uma string, assumimos que é uma base64
      const base64Image = event;
      const byteString = atob(base64Image.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // Criar um Blob a partir do byte array
      const blob = new Blob([ia], { type: 'image/png' });
      file = new File([blob], 'imagem.png', { type: 'image/png' });
    } else {
      // Caso seja um evento, tratamos como o evento de seleção do arquivo
      const fileInput = event.target as HTMLInputElement;
      if (fileInput?.files && fileInput.files[0]) {
        file = fileInput.files[0];
      }
    }

    if (file) {
      // Verifica se o arquivo é do tipo imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
      }

      // Exibir a imagem selecionada para pré-visualização
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const previewImage = document.getElementById(
            'previewImage'
          ) as HTMLImageElement;
          const uploadText = document.getElementById(
            'uploadText'
          ) as HTMLSpanElement;

          previewImage.src = e.target.result as string;
          previewImage.style.display = 'block';
          if (uploadText) {
            uploadText.style.display = 'none';
          }
        }
      };
      reader.readAsDataURL(file);

      // Atualizar o input de arquivo com o arquivo criado
      const fileInput = document.getElementById(
        'fileInput'
      ) as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
      }
    }
  }
}
