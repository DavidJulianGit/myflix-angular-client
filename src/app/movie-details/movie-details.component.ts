import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * Component for displaying detailed information about a movie.
 */
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  localUser: any = {};

  /**
   * Constructor of MovieDetailsComponent.
   * @param dialogRef Reference to the dialog opened by MatDialog.
   * @param data Data passed into the dialog, containing movie details.
   * @param fetchApiData Service for fetching data from the API.
   */
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

  /**
   * Checks if a movie is marked as favorite by the current user.
   * @param movieId ID of the movie to check.
   * @returns True if the movie is marked as favorite, false otherwise.
   */
  isFavorite(movieId: string): boolean {
    return this.localUser.favoriteMovies.includes(movieId);
  }

  /**
   * Toggles the favorite status of a movie for the current user.
   * If the movie is already a favorite, it removes it; otherwise, it adds it.
   * @param movieId ID of the movie to toggle favorite status.
   */
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
