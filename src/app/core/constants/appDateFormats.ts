import { MatDateFormats } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

export const APP_DATE_FORMATS: MatDateFormats = {
  ...MAT_MOMENT_DATE_FORMATS,
  display: { ...MAT_MOMENT_DATE_FORMATS.display, dateInput: 'DD/MM/yyyy' },
};
