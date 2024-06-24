import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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

  constructor(
    public dialog: MatDialog,
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Load user data and token from local storage
    this.localUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('users birthday', this.localUser.birthday);
    this.token = localStorage.getItem('token') || '';

    // Format birthday for input field
    this.localUser.birthday = this.formatDateForInput(this.localUser.birthday);

    // get favorites
    this.getFavoriteMovies();

    // String the user has to input in order to enable deleting his account
    this.stringToDeleteAccount = `Delete account ${this.localUser.email}`;
  }

  formatDateForInput(dateString: string): string {
    // Ensure dateString is not null or empty
    if (!dateString) return '';

    // Convert to Date object
    const date = new Date(dateString);

    // Use DatePipe to format date
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  togglePasswordVisibility(): void {
    this.passwordShown = !this.passwordShown;
  }

  toggleFavoriteMovies(): void {
    this.showFavoriteMovies = !this.showFavoriteMovies;
  }

  updateUserData(): void {
    const data = {
      firstname: this.localUser.firstname,
      lastname: this.localUser.lastname,
      email: this.localUser.email,
      birthday: this.localUser.birthday,
    };

    this.fetchApiData.editUser(data).subscribe(
      (response: any) => {
        console.log('Update successful:', this.extractResponseData(response));

        // Optionally update local user data if necessary
        this.localUser = response;
        localStorage.setItem('user', JSON.stringify(this.localUser));
        // Format birthday for input field
        this.localUser.birthday = this.formatDateForInput(
          this.localUser.birthday
        );

        this.snackBar.open('Profile updated successfully', 'Close');
      },
      (error) => {
        console.error('Error updating user data:', error);

        // Show error message using snackbar
        this.snackBar.open(
          'Failed to update profile. Please try again.',
          'Close'
        );
      }
    );
  }

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

  // opens the ConfirmDialogComponent
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(); // Call delete method only if user confirmed
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  // Method to confirm and delete user account
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe({
      next: (response) => {
        console.log(response.message); // Log the response message

        // Clear user from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        this.router.navigate(['']); // Navigate to login after deletion

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

  getFavoriteMovies() {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp?.filter((movie: any) =>
        this.localUser?.favoriteMovies.includes(movie._id)
      );
    });
  }

  addFavoriteMovie(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((result) => {
      console.log(result);
      this.favoriteMovies.push(result);
      this.localUser.favoriteMovies.push(movieId);
      localStorage.setItem('user', JSON.stringify(this.localUser));
    });
  }

  removeFavoriteMovie(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((result) => {
      console.log(result);
      this.favoriteMovies = this.favoriteMovies.filter(
        (movie) => movie._id !== movieId
      );
      this.localUser.favoriteMovies = this.localUser.favoriteMovies.filter(
        (id: string) => id !== movieId
      );
      localStorage.setItem('user', JSON.stringify(this.localUser));
    });
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

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

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }
}
