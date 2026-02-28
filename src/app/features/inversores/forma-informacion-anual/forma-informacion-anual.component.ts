import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-forma-informacion-anual',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './forma-informacion-anual.component.html',
  styleUrls: ['./forma-informacion-anual.component.scss']
})
export class FormaInformacionAnualComponent {}
