import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HistoryComponent } from './features/history/history.component';
import { VehicleDetailComponent } from './features/vehicle-detail/vehicle-detail.component';
import { AlprComponent } from './features/alpr/alpr.component';
import { AssistantComponent } from './features/assistant/assistant.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'alpr', component: AlprComponent },
  { path: 'assistant', component: AssistantComponent },
  { path: 'vehicle/:plate', component: VehicleDetailComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
