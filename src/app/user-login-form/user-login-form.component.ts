import { Component, OnInit, Input } from '@angular/core';

// import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

//  import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = {
    firstname: '',
    lastname: '',
    password: '',
    email: '',
    birthday: '',
  };

  hidePassword: boolean = true; // Flag to toggle password visibility

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      // Successful fetch
      (result) => {
        this.dialogRef.close();

        console.log(result);

        // save user to local storage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        //navigate to movies component
        this.router.navigate(['movies']);
      },

      // Failed fetch
      (error) => {
        console.error('Login failed:', error.message);
        this.snackBar.open(error.message, 'OK', {
          duration: 5000,
        });
      }
    );
  }
}
