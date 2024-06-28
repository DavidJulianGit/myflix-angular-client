// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for user registration form.
 * Responsible for handling user registration via backend API calls.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent {
  userData = {
    firstname: '',
    lastname: '',
    password: '',
    email: '',
    birthday: '',
  };

  /**
   * Boolean flag to toggle password readability.
   */
  hidePassword: boolean = true;

  /**
   * Constructor of UserRegistrationFormComponent.
   * @param fetchApiData Service for fetching API data.
   * @param dialogRef Reference to the MatDialog that opened the component.
   * @param snackBar Service for displaying notifications to the user.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Sends user registration data to backend for registration.
   * Subscribes to the registration API call and handles success or error responses.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        this.snackBar.open(
          'Your account is now ready. Please login to contine.',
          'OK',
          {
            duration: 2000,
          }
        );
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
