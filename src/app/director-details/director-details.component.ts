import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent implements OnInit {
  director: any;

  constructor(
    public dialogRef: MatDialogRef<DirectorDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.director = data.director;
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
