import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Declaring the api url that will provide data for the client app
  apiUrl = 'https://myflix-z30i.onrender.com/';

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(this.apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Method for user login
  public userLogin(userDetails: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // Method to get all movies
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(this.apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Method to get one movie by title
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(this.apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Method to get director details
  public getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(this.apiUrl + 'directors/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Method to get genre details
  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(this.apiUrl + 'genres/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Method to get favorite movies for a user
  public getFavoriteMovies(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(
        this.apiUrl + 'users/' + userDetails.email + '/favoriteMovies',
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Method to add a movie to favorite movies
  public addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;

    return this.http
      .post(
        this.apiUrl + 'users/' + userEmail + '/favoriteMovies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  // Method to delete a movie from favorite movies
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
    const token = localStorage.getItem('token');

    return this.http
      .delete(
        this.apiUrl + 'users/' + userEmail + '/favoriteMovies/' + movieId,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  // Method to get user details
  public getUser(): string | null {
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('An error occurred: no user found! Please login.');
    }
    return user;
  }

  // Method to edit user details
  public editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const email = JSON.parse(localStorage.getItem('user') || '{}').email;

    return this.http
      .patch(this.apiUrl + 'users/' + email, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Method to delete user
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const email = JSON.parse(localStorage.getItem('user') || '{}').email;

    return this.http
      .delete(this.apiUrl + 'users/' + email, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text', // Specify response type as 'text'
      })
      .pipe(
        map((response) => {
          return { message: response };
        }),
        catchError(this.handleError)
      );
  }
  /**
   * Handles HTTP errors.
   * @param error HttpErrorResponse object.
   * @returns Observable with error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error) {
      // Server-side error
      // Check if the error is a string
      if (typeof error.error === 'string') {
        errorMessage = error.error; // Error is a simple string message
      } else if (error.error.message) {
        errorMessage = error.error.message; // Error is an object containing a message property
      } else if (Array.isArray(error.error.errors)) {
        errorMessage = error.error.errors.map((e: any) => e.message).join(', '); // Error is an array of validation errors or similar
      } else {
        errorMessage = JSON.stringify(error.error); // Error is a complex object without a standard structure
      }
    } else {
      errorMessage = `Error Status code ${error.status}, Error body is: ${error.message}`;
    }

    console.error('Error handling response:', error);
    return throwError(errorMessage);
  }

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }
}
