import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
type TituloMenuTypes = 'principal' | 'subtitulo';
@Component({
  selector: 'app-titulo-menu',
  templateUrl: './titulo-menu.component.html',
  styleUrls: ['./titulo-menu.component.css'],
})
export class TituloMenuComponent implements OnInit {
  @Input() type: TituloMenuTypes = 'principal';
  @Input() src: string = '';
  @Input() name: string = '';
  @Input() path: string = '';
  @Input() open: boolean = false;
  @Input() selected: boolean = false;
  @Input() sair: boolean = false;
  @Output() logout = new EventEmitter();

  ngOnInit(): void {}
  constructor(private router: Router) {}

  navegate() {
    if (this.path != 'logout' && this.path != '') {
      this.router.navigate([this.path]);
    } else {
      this.logout.emit();
    }
  }
}
