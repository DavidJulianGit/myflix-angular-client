import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  localUser: any = {};

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fetchApiData: FetchApiDataService
  ) {
    this.movie = data.movie;
  }

  ngOnInit(): void {
    this.localUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  isFavorite(movieId: string): boolean {
    return this.localUser.favoriteMovies.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((result) => {
        this.localUser.favoriteMovies = this.localUser.favoriteMovies.filter(
          (id: string) => id !== movieId
        );
        localStorage.setItem('user', JSON.stringify(this.localUser));
      });
    } else {
      this.fetchApiData.addFavoriteMovie(movieId).subscribe((result) => {
        this.localUser.favoriteMovies.push(movieId);
        localStorage.setItem('user', JSON.stringify(this.localUser));
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
