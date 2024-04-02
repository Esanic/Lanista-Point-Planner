import { Component } from '@angular/core';
import { ImportModalComponent } from '../../_modals/import-modal/import-modal.component';

@Component({
  selector: 'app-import-build-button',
  standalone: true,
  imports: [ImportModalComponent],
  templateUrl: './import-build-button.component.html',
  styleUrl: './import-build-button.component.css',
})
export class ImportBuildButtonComponent {
  public viewImportModal: boolean = false;

  constructor() {}

  public importBuild(): void {
    this.viewImportModal = true;
  }

  public closeModal() {
    this.viewImportModal = false;
  }

  public dismissModal() {
    this.viewImportModal = false;
  }
}
