import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ParkingService, Entry } from '../../core/services/parking.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['plateNumber', 'entryTime', 'exitTime', 'duration', 'amount', 'status', 'actions'];
  dataSource = new MatTableDataSource<Entry>([]);
  
  loading = true;
  error: string | null = null;
  
  totalEntries = 0;
  pageSize = 10;
  currentPage = 0;
  
  searchPlate = '';

  constructor(
    private parkingService: ParkingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = null;

    const page = this.currentPage + 1;
    const plateFilter = this.searchPlate.trim() || undefined;

    this.parkingService.getHistory(page, this.pageSize, plateFilter).subscribe({
      next: (response) => {
        this.dataSource.data = response.entries;
        this.totalEntries = response.pagination.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de connexion au serveur';
        this.loading = false;
        console.error('Erreur history:', err);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHistory();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadHistory();
  }

  clearSearch(): void {
    this.searchPlate = '';
    this.currentPage = 0;
    this.loadHistory();
  }

  viewDetails(plateNumber: string): void {
    this.router.navigate(['/vehicle', plateNumber]);
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
}
