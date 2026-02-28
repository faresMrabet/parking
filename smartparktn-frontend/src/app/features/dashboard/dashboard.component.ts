import { Component, OnInit } from '@angular/core';
import { ParkingService, DashboardData } from '../../core/services/parking.service';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;
  error: string | null = null;

  constructor(private parkingService: ParkingService) { }

  ngOnInit(): void {
    this.loadDashboard();
    
    // Rafraîchir toutes les 30 secondes
    interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.parkingService.getDashboard())
      )
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Erreur de connexion au serveur';
          this.loading = false;
          console.error('Erreur dashboard:', err);
        }
      });
  }

  loadDashboard(): void {
    this.loading = true;
    this.parkingService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de connexion au serveur';
        this.loading = false;
        console.error('Erreur dashboard:', err);
      }
    });
  }

  refresh(): void {
    this.loadDashboard();
  }
}
