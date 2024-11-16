import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../core/services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading$; // Observa o estado do loader
  }

  ngOnInit() {}
}
