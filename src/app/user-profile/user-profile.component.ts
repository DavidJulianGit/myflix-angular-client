import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * Component for managing user profile information and actions.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [DatePipe],
})
export class UserProfileComponent implements OnInit {
  // bind the ng-template with the identifier #deleteConfirmationDialog
  @ViewChild('deleteConfirmationDialog')
  deleteConfirmationDialog!: TemplateRef<any>;

  favoriteMovies: any[] = [];
  localUser: any = {};
  newPassword: string = '';
  newPasswordRepeat: string = '';
  passwordShown: boolean = false;
  checkPhrase: boolean = false;
  showModal: boolean = false;
  modalData: { title: string; message: string } = { title: '', message: '' };
  showDeleteConfirmationModal: boolean = false;
  showPasswordChangeModal: boolean = false;
  stringToDeleteAccount: string = '';
  deleteAccountCheck: string = '';
  token: string = '';
  updateUserDataURL: string = '';
  showFavoriteMovies: boolean = true;

  /**
   * Constructor of UserProfileComponent.
   * @param dialog MatDialog service for opening dialogs.
   * @param fetchApiData FetchApiDataService for making API requests.
   * @param router Router for navigation.
   * @param snackBar MatSnackBar for displaying notifications.
   * @param datePipe DatePipe for date formatting.
   */
  constructor(
    public dialog: MatDialog,
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.localUser = JSON.parse(localStorage.getItem('user') || '{}');

    this.token = localStorage.getItem('token') || '';

    this.localUser.birthday = this.formatDateForInput(this.localUser.birthday);

    this.getFavoriteMovies();

    this.stringToDeleteAccount = `Delete account ${this.localUser.email}`;
  }

  /**
   * Formats date string for input field.
   * @param dateString Date string to format.
   * @returns Formatted date string ('yyyy-MM-dd') or empty string if input is falsy.
   */
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  /**
   * Toggles visibility of passwordreadability.
   */
  togglePasswordVisibility(): void {
    this.passwordShown = !this.passwordShown;
  }

  /**
   * Toggles display of favorite movies section.
   */
  toggleFavoriteMovies(): void {
    this.showFavoriteMovies = !this.showFavoriteMovies;
  }

  /**
   * Updates user data (firstname, lastname, email, birthday) via API request.
   * Displays success or error message using MatSnackBar.
   */
  updateUserData(): void {
    const data = {
      firstname: this.localUser.firstname,
      lastname: this.localUser.lastname,
      email: this.localUser.email,
      birthday: this.localUser.birthday,
    };

    this.fetchApiData.editUser(data).subscribe(
      (response: any) => {
        this.localUser = response;
        localStorage.setItem('user', JSON.stringify(this.localUser));

        this.localUser.birthday = this.formatDateForInput(
          this.localUser.birthday
        );

        this.snackBar.open('Profile updated successfully', 'Close');
      },
      (error) => {
        console.error('Error updating user data:', error);
        this.snackBar.open(
          'Failed to update profile. Please try again.',
          'Close'
        );
      }
    );
  }

  /**
   * Changes user password via API request.
   * Displays success or error message using MatSnackBar.
   */
  changePassword(): void {
    const data = {
      firstname: this.localUser.firstname,
      lastname: this.localUser.lastname,
      password: this.newPassword,
    };

    this.fetchApiData.editUser(data).subscribe({
      next: (response: any) => {
        console.log('Password changed successfully:', response);
        this.snackBar.open('Password changed successfully.', 'Close', {
          duration: 1500,
        });
      },
      error: (error: any) => {
        console.error('Error changing password:', error);
        this.snackBar.open(
          `Failed to change password. Error: ${error.error.message}`,
          'Close',
          {
            duration: 1500,
          }
        );
      },
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser();
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  /**
   * Deletes user account via API request.
   * Logs out user after successful deletion and displays success or error message using MatSnackBar.
   */
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe({
      next: (response) => {
        this.logout();

        this.snackBar.open('Your account has been deleted.', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        this.snackBar.open(error, 'Close', { duration: 3000 });
      },
    });
  }

  /**
   * Fetches favorite movies for the current user.
   * Updates `favoriteMovies` array based on API response.
   */
  getFavoriteMovies() {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp?.filter((movie: any) =>
        this.localUser?.favoriteMovies.includes(movie._id)
      );
    });
  }

  /**
   * Adds a movie to the user's list of favorite movies via API request.
   * Updates `favoriteMovies` and `localUser` data upon successful addition.
   * @param movieId ID of the movie to add to favorites.
   */
  addFavoriteMovie(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((result) => {
      this.favoriteMovies.push(result);
      this.localUser.favoriteMovies.push(movieId);
      localStorage.setItem('user', JSON.stringify(this.localUser));
    });
  }

  /**
   * Removes a movie from the user's list of favorite movies via API request.
   * Updates `favoriteMovies` and `localUser` data upon successful removal.
   * @param movieId ID of the movie to remove from favorites.
   */
  removeFavoriteMovie(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((result) => {
      this.favoriteMovies = this.favoriteMovies.filter(
        (movie) => movie._id !== movieId
      );
      this.localUser.favoriteMovies = this.localUser.favoriteMovies.filter(
        (id: string) => id !== movieId
      );
      localStorage.setItem('user', JSON.stringify(this.localUser));
    });
  }

  /**
   * Logs out the current user by removing user and token from localStorage and navigating to welcome page.
   */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * Redirects the user to the movies page.
   */
  redirectMovieCard(): void {
    this.router.navigate(['movies']);
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorDetailsComponent, {
      data: { director: movie.director },
      width: '600px',
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
}
