import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cobertura-analistas',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent ],
  templateUrl: './cobertura-analistas.component.html',
  styleUrls: ['./cobertura-analistas.component.scss']
})
export class CoberturaAnalistasComponent {}
