import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying genre details in a dialog.
 */
@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.scss'],
})
export class GenreDetailsComponent {
  genres: any[];

  /**
   * Constructor of GenreDetailsComponent.
   * @param dialogRef Reference to the dialog opened by MatDialog.
   * @param data Data passed into the dialog, containing genres to display.
   */
  constructor(
    public dialogRef: MatDialogRef<GenreDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.genres = data.genres;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
