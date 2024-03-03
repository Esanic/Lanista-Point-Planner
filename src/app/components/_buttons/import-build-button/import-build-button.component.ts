import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-import-build-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './import-build-button.component.html',
  styleUrl: './import-build-button.component.css'
})
export class ImportBuildButtonComponent {
  
  async importBuild(): Promise<void> {
  }

}
