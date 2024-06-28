import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Injectable service for handling API requests and responses.
 * Uses Angular HttpClient for HTTP operations.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /**
   * Base URL of the API server providing data for the client app.
   */
  private apiUrl = 'https://myflix-z30i.onrender.com/';

  /**
   * Injects the HttpClient module into the service.
   * @param http Angular HttpClient module for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Makes an API call to register a new user.
   * @param userDetails User registration details.
   * @returns Observable with the response data from the server.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(this.apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Makes an API call to log in a user.
   * @param userDetails User login credentials (email and password).
   * @returns Observable with the response data from the server.
   */
  public userLogin(userDetails: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all movies from the API.
   * @returns Observable with the response data from the server.
   */
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

  /**
   * Retrieves the favorite movies of the current user from the API.
   * @param userDetails User details (specifically email) to fetch favorite movies.
   * @returns Observable with the response data from the server.
   */
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

  /**
   * Adds a movie to the user's favorite movies list.
   * @param movieId ID of the movie to add to favorites.
   * @returns Observable with the response data from the server.
   */
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

  /**
   * Removes a movie from the user's favorite movies list.
   * @param movieId ID of the movie to remove from favorites.
   * @returns Observable with the response data from the server.
   */
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

  /**
   * Updates user details via PATCH request.
   * @param userDetails Updated user details.
   * @returns Observable with the response data from the server.
   */
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

  /**
   * Deletes user account via DELETE request.
   * @returns Observable with the response data from the server.
   */
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
   * Handles HTTP errors returned from API requests.
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

  /**
   * Extracts response data from HTTP response.
   * @param res Response object from HTTP request.
   * @returns Response body or an empty object if body is null.
   */
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }
}
