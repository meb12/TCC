import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-paginacao',
  templateUrl: './paginacao.component.html',
  styleUrls: ['./paginacao.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaginacaoComponent),
      multi: true,
    },
  ],
})
export class PaginacaoComponent implements OnInit {
  @Input() pages: number = 0;
  @Output() selectedPage = new EventEmitter<number>();
  currentPage: number = 0;

  getPageNumbers(): number[] {
    return Array.from({ length: this.pages }, (_, index) => index);
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.selectedPage.emit(pageNumber);
  }

  getVisiblePages(): number[] {
    if (this.pages <= 5) {
      return this.getPageNumbers();
    }

    const pages: number[] = [];
    pages.push(0);

    if (this.currentPage > 2) {
      pages.push(-1);
    }

    const startPage = Math.max(1, this.currentPage - 1);
    const endPage = Math.min(this.pages - 2, this.currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (this.currentPage < this.pages - 3) {
      pages.push(-2);
    }

    pages.push(this.pages - 1);

    return pages;
  }

  goToNextPage() {
    if (this.currentPage < this.pages - 1) {
      this.currentPage++;
      this.selectedPage.emit(this.currentPage);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.selectedPage.emit(this.currentPage);
    }
  }

  goNextDots() {
    this.currentPage += 2;
    if (this.currentPage >= this.pages - 1) {
      this.currentPage = this.pages - 2;
    }
    this.selectedPage.emit(this.currentPage);
  }

  goPreviousDots() {
    this.currentPage -= 2;
    if (this.currentPage <= 0) {
      this.currentPage = 1;
    }
    this.selectedPage.emit(this.currentPage);
  }

  constructor() {}

  ngOnInit() {}
}
