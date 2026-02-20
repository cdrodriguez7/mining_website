import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estma',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estma.component.html',
  styleUrls: ['./estma.component.scss']
})
export class EstmaComponent {}