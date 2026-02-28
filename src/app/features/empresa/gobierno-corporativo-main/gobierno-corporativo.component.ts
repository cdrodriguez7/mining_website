import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-gobierno-corporativo',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './gobierno-corporativo.component.html',
  styleUrls: ['./gobierno-corporativo.component.scss']
})
export class GobiernoCorporativoComponent {}
