// src/app/app-routing.module.ts
import { Routes } from '@angular/router';
import { ProcessoComponent } from './processo/processo.component';

export const routes: Routes = [
  { path: 'processo', component: ProcessoComponent },
  { path: '', redirectTo: '/processo', pathMatch: 'full' },
  { path: '**', redirectTo: '/processo' }

];

export const appRoutes = routes; 
