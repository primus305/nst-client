import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {File} from '../../model/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  getFile(file) {
    return this.httpClient.get<File>('http://localhost:8080/file/get/' + file);
  }

  downloadFile(fileName) {
    return this.httpClient.get('http://localhost:8080/file/download/' + fileName, { responseType: 'blob' });
  }
}
