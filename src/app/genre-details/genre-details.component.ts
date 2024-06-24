import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.scss'],
})
export class GenreDetailsComponent implements OnInit {
  genres: any[];

  constructor(
    public dialogRef: MatDialogRef<GenreDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.genres = data.genres;
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
