import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  @Input() movie: any;
  localUser: any = {};
  movies: any[] = [];
  loading: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.localUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  getMovies(): void {
    /*this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;

      return this.movies;
    });*/
    this.loading = true; // Set loading to true before starting the request
    this.fetchApiData.getAllMovies().subscribe({
      next: (response: any) => {
        this.movies = response;
        this.loading = false; // Set loading to false after data is received
      },
      error: (err) => {
        console.error(err);
        this.loading = false; // Set loading to false if there's an error
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
}
