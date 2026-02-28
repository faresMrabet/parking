import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkingService, Entry } from '../../core/services/parking.service';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss']
})
export class VehicleDetailComponent implements OnInit {
  plateNumber: string = '';
  entries: Entry[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parkingService: ParkingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.plateNumber = params['plate'];
      this.loadVehicleData();
    });
  }

  loadVehicleData(): void {
    this.loading = true;
    this.error = null;

    this.parkingService.getVehicleEntries(this.plateNumber).subscribe({
      next: (response) => {
        this.entries = response.entries;
        this.loading = false;
        
        if (this.entries.length === 0) {
          this.error = 'Aucune donnée trouvée pour ce véhicule';
        }
      },
      error: (err) => {
        this.error = 'Erreur de connexion au serveur';
        this.loading = false;
        console.error('Erreur vehicle detail:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/history']);
  }

  getStatusColor(status: string): string {
    return status === 'authorized' ? 'primary' : 'warn';
  }

  getStatusLabel(status: string): string {
    return status === 'authorized' ? 'Autorisé' : 'Refusé';
  }

  formatDuration(duration: number | null): string {
    if (duration === null) return 'En cours';
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  getTotalAmount(): number {
    return this.entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  getTotalVisits(): number {
    return this.entries.length;
  }

  getActiveEntry(): Entry | null {
    return this.entries.find(e => e.exitTime === null) || null;
  }
}
