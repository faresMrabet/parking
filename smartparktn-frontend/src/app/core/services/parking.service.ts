import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  vehiclesInParking: number;
  todayRevenue: number;
  todayEntries: number;
  todayRefused: number;
  date: string;
}

export interface Entry {
  _id: string;
  plateNumber: string;
  entryTime: string;
  exitTime: string | null;
  duration: number | null;
  amount: number;
  status: 'authorized' | 'refused';
  ruleApplied: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryResponse {
  entries: Entry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface EntryRequest {
  plateNumber: string;
}

export interface EntryResponse {
  plateNumber: string;
  status: 'authorized' | 'refused';
  entryTime?: string;
  vehicleType?: string;
  reason?: string;
}

export interface ExitResponse {
  plateNumber: string;
  entryTime: string;
  exitTime: string;
  duration: number;
  amount: number;
  ruleApplied: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`);
  }

  getHistory(page: number = 1, limit: number = 50, plateNumber?: string): Observable<HistoryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (plateNumber) {
      params = params.set('plateNumber', plateNumber);
    }

    return this.http.get<HistoryResponse>(`${this.baseUrl}/history`, { params });
  }

  getVehicleEntries(plateNumber: string): Observable<HistoryResponse> {
    return this.http.get<HistoryResponse>(`${this.baseUrl}/history`, {
      params: new HttpParams().set('plateNumber', plateNumber)
    });
  }

  registerEntry(data: EntryRequest): Observable<EntryResponse> {
    return this.http.post<EntryResponse>(`${this.baseUrl}/entry`, data);
  }

  registerExit(data: EntryRequest): Observable<ExitResponse> {
    return this.http.post<ExitResponse>(`${this.baseUrl}/exit`, data);
  }
}
