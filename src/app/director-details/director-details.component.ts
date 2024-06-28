import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying director details in a dialog.
 */
@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent {
  director: any;

  /**
   * Constructor of DirectorDetailsComponent.
   * @param dialogRef Reference to the dialog opened by MatDialog.
   * @param data Data passed into the dialog, containing director information.
   */
  constructor(
    public dialogRef: MatDialogRef<DirectorDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.director = data.director;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
