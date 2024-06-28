import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component for displaying a confirmation dialog for account deletion.
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
  /**
   * Handles the confirm action by closing the dialog with a true value.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Handles the cancel action by closing the dialog with a false value.
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
