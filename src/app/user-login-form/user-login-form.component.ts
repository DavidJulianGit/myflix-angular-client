import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component handling user login functionality.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent {
  userData = {
    password: '',
    email: '',
  };

  /**
   * Boolean flag to toggle password readability.
   */
  hidePassword: boolean = true;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Sends user login data to backend for authentication.
   * Subscribes to the login API call and handles success or error responses.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        this.router.navigate(['movies']);
      },

      (error) => {
        console.error('Login failed:', error.message);
        this.snackBar.open(error.message, 'OK', {
          duration: 5000,
        });
      }
    );
  }
}
