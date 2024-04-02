import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../support/services/global.service';
import { TableService } from '../../../support/services/table.service';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [FormsModule, NgbModalModule, ReactiveFormsModule],
  templateUrl: './import-modal.component.html',
  styleUrl: './import-modal.component.css',
})
export class ImportModalComponent implements AfterViewInit {
  public jsonString = new FormControl('');

  @Output() closeModal = new EventEmitter();
  @Output() dismissModal = new EventEmitter();

  @ViewChild('modalContent') modalContent!: ElementRef<any>;
  modal!: NgbModalRef;

  constructor(private modalService: NgbModal, private globalService: GlobalService, private tableService: TableService) {}

  ngAfterViewInit(): void {
    this.openModal(this.modalContent);

    this.modal.result.then(
      (resolved) => {
        if (this.jsonString.value !== null) {
          const jsonObject = JSON.parse(this.jsonString.value);
          console.log(jsonObject);
          this.globalService.setChosenRace(jsonObject.race);
          this.globalService.setChosenWeaponSkill(jsonObject.weaponSkill);
          this.globalService.setImportedStats(jsonObject.levels);
        }
        this.closeModal.emit(resolved);
      },
      (dismissed) => {
        this.dismissModal.emit(dismissed);
      }
    );
  }

  public openModal(modalContent: any): void {
    this.modal = this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
  }
}
