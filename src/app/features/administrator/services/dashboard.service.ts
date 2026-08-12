import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../interfaces/dashboard-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl
  private branch = `${this.apiUrl}/dashboard`

  exportExcel(){
    return this.http.get( `${this.branch}/export-excel`,{responseType: 'blob'} )
  }
}
