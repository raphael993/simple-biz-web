import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IndexedDbService } from '../../storage/indexedDb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin.html'
})
export class AdminComponent {
  private readonly indexedDb = inject(IndexedDbService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  async exportData() {
    const data = await this.indexedDb.exportAll();
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-simple-biz.json';
    a.click();
    URL.revokeObjectURL(url);

    this.snackBar.open('Backup exportado com sucesso', 'OK', {
      duration: 3000
    });
  }

  async importData(event: Event) {
    if (!confirm('Isso irá substituir todos os dados atuais. Deseja continuar?')) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const text = await file.text();
    const data = JSON.parse(text);

    await this.indexedDb.importAll(data);

    this.snackBar.open('Backup importado com sucesso', 'OK', {
      duration: 3000
    });

    input.value = '';

    this.router.navigate(['/']);
  }

  async resetDb() {
    if (!confirm('Isso irá remover todos os dados atuais. Deseja continuar?')) {
      return;
    }
    await this.indexedDb.resetDb();

    this.snackBar.open('Banco de dados resetado com sucesso', 'OK', {
      duration: 3000
    });
  }
}
