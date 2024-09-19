import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterModule } from '@angular/router';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { APP_DATE_FORMATS } from '../core/constants/appDateFormats';
import { AppPaginatorIntl } from '../core/utils/appPaginatorIntl';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatRippleModule,
    MatToolbarModule,
    MatExpansionModule,
    RouterModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatAutocompleteModule,
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    OverlayModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      extendedTimeOut: 5000,
      progressBar: true,
      closeButton: true,
      tapToDismiss: false,
    }),
    MatButtonToggleModule,
  ],
  exports: [
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatRippleModule,
    MatToolbarModule,
    MatExpansionModule,
    RouterModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatAutocompleteModule,
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    OverlayModule,
    ToastrModule,
    MatButtonToggleModule,
  ],
  providers: [
    provideNgxMask(), // Uso correto do provider
    { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
  ],
})
export class SharedModule {}
