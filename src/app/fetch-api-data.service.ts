import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-z30i.onrender.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Method for user login
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails.email)
      .pipe(catchError(this.handleError));
  }

  // Method to get all movies
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(apiUrl + 'movies', {
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
      .get<any>(apiUrl + 'movies/' + title, {
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
      .get<any>(apiUrl + 'directors/' + name, {
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
      .get<any>(apiUrl + 'genres/' + name, {
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
      .get<any>(apiUrl + 'users/' + userDetails.email + 'favoriteMovies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Method to add a movie to favorite movies
  public addFavoriteMovie(movieId: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(
        apiUrl + 'users/' + userDetails.email + 'favoriteMovies/' + movieId,
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
  public deleteFavoriteMovie(
    movieId: string,
    userDetails: any
  ): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(
        apiUrl + 'users/' + userDetails.email + 'favoriteMovies/' + movieId,
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
    return this.http
      .patch(apiUrl + 'users' + userDetails.email, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Method to delete user
  public deleteUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users' + userDetails.email, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }
}
