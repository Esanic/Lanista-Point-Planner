import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../support/services/global.service';
import { BuildService } from '../../../support/services/build.service';

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

  constructor(private modalService: NgbModal, private buildService: BuildService, private globalService: GlobalService) {}

  ngAfterViewInit(): void {
    this.openModal(this.modalContent);

    this.modal.result.then(
      async (resolved) => {
        if (this.jsonString.value !== null) {
          const jsonObject = JSON.parse(this.jsonString.value);
          this.buildService.setChosenRace(this.globalService.selectRaceFromRaceName(jsonObject.race));
          this.buildService.setChosenWeaponSkill(jsonObject.weaponSkill);
          this.buildService.setImportedStats(jsonObject.levels);
          this.buildService.setAmountOfLevels(jsonObject.levels.length);

          this.buildService.emitDeselectBuild('');
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
