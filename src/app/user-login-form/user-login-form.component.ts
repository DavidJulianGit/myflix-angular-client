import { Component, OnInit, Input } from '@angular/core';

// import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

//  import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      // Successful fetch
      (result) => {
        this.dialogRef.close();
        this.snackBar.open(`Welcome ${result.user.firstname}`, 'OK', {
          duration: 3000,
        });

        console.log(result);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      },

      // Failed fetch
      (error) => {
        this.snackBar.open(error.error.message, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
