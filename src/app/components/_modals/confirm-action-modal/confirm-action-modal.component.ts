import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildService } from '../../../support/services/build.service';

@Component({
  selector: 'app-confirm-action-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-action-modal.component.html',
  styleUrl: './confirm-action-modal.component.css',
})
export class ConfirmActionModalComponent {
  @Input() texts = { title: '', body: '', confirm: '', cancel: '' };

  @Output() closeModal = new EventEmitter();
  @Output() dismissModal = new EventEmitter();

  @ViewChild('modalContent') modalContent!: ElementRef<any>;
  private modal!: NgbModalRef;

  constructor(private modalService: NgbModal, private buildService: BuildService) {}

  ngAfterViewInit(): void {
    this.openModal(this.modalContent);

    this.modal.result.then(
      (resolved) => {
        this.closeModal.emit(resolved);
      },
      (dismissed) => {
        this.dismissModal.emit(dismissed);
      }
    );
  }

  public openModal(modalContent: any): void {
    this.modal = this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title' });
  }
}
