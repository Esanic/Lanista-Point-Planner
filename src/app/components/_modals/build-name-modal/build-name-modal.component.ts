import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildService } from '../../../support/services/build.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { emptyString } from '../../../support/constants/global';

@Component({
  selector: 'app-build-name-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './build-name-modal.component.html',
  styleUrl: './build-name-modal.component.css',
})
export class BuildNameModalComponent {
  public buildName = new FormControl(emptyString);

  @Output() closeModal = new EventEmitter();
  @Output() dismissModal = new EventEmitter();

  @ViewChild('modalContent') modalContent!: ElementRef<any>;
  private modal!: NgbModalRef;

  constructor(private modalService: NgbModal, private buildService: BuildService) {
    this.buildName.valueChanges.subscribe(() => this.evaluateBuildName());
  }

  ngAfterViewInit(): void {
    this.openModal(this.modalContent);

    this.modal.result.then(
      (resolved) => {
        this.closeModal.emit(this.buildName.value);
      },
      (dismissed) => {
        this.dismissModal.emit(dismissed);
      }
    );
  }

  public openModal(modalContent: any): void {
    this.modal = this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title' });
  }

  public evaluateBuildName(): void {
    const builds = JSON.parse(localStorage.getItem('builds')!);

    if (builds.some((build: any) => build.name === this.buildName.value)) {
      this.buildName.setErrors({ duplicate: true });
    }
  }
}
