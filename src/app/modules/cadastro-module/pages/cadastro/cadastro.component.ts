import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CepService } from '../../../../core/services/cep.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  cadastroForm: FormGroup;
  tipoCadastro: string = ''; // Tipo do cadastro como string inicialmente vazio
  sexoOptions = [
    { value: 1, name: 'Masculino' },
    { value: 2, name: 'Feminino' },
    { value: 3, name: 'Prefiro não dizer' },
  ];
  nacionalidades: any[] = []; // Array para armazenar nacionalidades

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient // HttpClient injetado para requisições HTTP
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.setupRouteListener();
    this.fetchnacionalidades();
  }

  private initializeForm() {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      rg: [''],
      telefone: ['', Validators.required],
      celular: ['', Validators.required],
      nacionalidade: [''],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      especialidade: [''],
      crm: [''],
      qualificacoesAdicionais: [''],
      informacoesAdicionais: [''],
      instituicaoEnsino: [''],
      anoFormacao: [''],
    });

    this.cadastroForm.get('cep')?.valueChanges.subscribe((cep) => {
      const cleanCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (cleanCep.length === 8) {
        this.getCepData(cleanCep);
      } else {
        this.clearAddressFields();
      }
    });
  }

  private setupRouteListener() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlSegments = this.router.url.split('/');
        if (urlSegments.length > 2) {
          this.tipoCadastro = urlSegments[2]; // Atualiza o tipo de cadastro baseado na URL
        }
      });
  }

  private clearAddressFields() {
    this.cadastroForm.patchValue({
      logradouro: '',
      bairro: '',
      cidade: '',
      uf: '',
    });
  }

  fetchnacionalidades() {
    const url = 'https://restcountries.com/v3.1/all';
    this.http.get<Country[]>(url).subscribe({
      next: (countries) => {
        this.nacionalidades = countries.map((country) => ({
          id: country.cca3,
          name: country.translations?.por?.common || country.name.common,
        }));
      },
      error: (error) => {
        console.error('Failed to fetch nacionalidades:', error);
        this.nacionalidades = [];
      },
    });
  }

  getCepData(cep: string) {
    this.cepService.getAddressByCep(cep).subscribe((data) => {
      if (!data.erro) {
        this.cadastroForm.patchValue({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        });
      } else {
        console.error('CEP não encontrado');
      }
    });
  }

  handleConfirm() {
    if (this.cadastroForm.valid) {
      console.log(this.cadastroForm.value);
    } else {
      console.log(this.cadastroForm.value);
      console.error('Formulário inválido');
    }
  }

  handleCancel() {
    this.cadastroForm.reset(); // Limpa o formulário
  }
}
