import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

/**
 * Component representing a movie card.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  /**
   * Input property representing the movie data.
   */
  @Input() movie: any;

  /**
   * Object representing the logged-in user's data fetched from local storage.
   */
  localUser: any = {};

  /**
   * Array of movies fetched from the backend.
   */
  movies: any[] = [];

  /**
   * Flag indicating if movies are currently being loaded.
   */
  loading: boolean = false;

  /**
   * Constructor of MovieCardComponent.
   * @param fetchApiData Service for fetching API data.
   * @param router Router service for navigation.
   * @param dialog MatDialog service for opening dialogs.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.localUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * Fetches all movies from the backend.
   * Sets loading to true before starting the request and false after receiving data.
   * Handles errors by logging them and setting loading to false.
   */
  getMovies(): void {
    this.loading = true;

    this.fetchApiData.getAllMovies().subscribe({
      next: (response: any) => {
        this.movies = response;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  redirectProfile(): void {
    this.router.navigate(['profile']);
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorDetailsComponent, {
      data: { director: movie.director },
    });
  }

  openGenreDialog(movie: any): void {
    this.dialog.open(GenreDetailsComponent, {
      data: { genres: movie.genres },
      width: '600px',
    });
  }

  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: { movie },
    });
  }

  /**
   * Checks if a movie is marked as favorite by the logged-in user.
   * @param movieId The ID of the movie to check against the user's favorites.
   * @returns Boolean indicating if the movie is a favorite.
   */
  isFavorite(movieId: string): boolean {
    return this.localUser.favoriteMovies.includes(movieId);
  }

  /**
   * Toggles the favorite status of a movie for the logged-in user.
   * Adds or removes the movie from the user's favorites and updates local storage accordingly.
   * @param movieId The ID of the movie to add or remove from favorites.
   */
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      // If movie is already favorite, remove it
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((result) => {
        this.localUser.favoriteMovies = this.localUser.favoriteMovies.filter(
          (id: string) => id !== movieId
        );
        localStorage.setItem('user', JSON.stringify(this.localUser));
      });
    } else {
      // If movie is not favorite, add it
      this.fetchApiData.addFavoriteMovie(movieId).subscribe((result) => {
        this.localUser.favoriteMovies.push(movieId);
        localStorage.setItem('user', JSON.stringify(this.localUser));
      });
    }
  }
}
