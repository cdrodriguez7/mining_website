import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LightboxImage {
  src: string;
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LightboxService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private imagesSubject = new BehaviorSubject<LightboxImage[]>([]);
  private currentIndexSubject = new BehaviorSubject<number>(0);

  isOpen$ = this.isOpenSubject.asObservable();
  images$ = this.imagesSubject.asObservable();
  currentIndex$ = this.currentIndexSubject.asObservable();

  open(images: LightboxImage[], index: number = 0) {
    this.imagesSubject.next(images);
    this.currentIndexSubject.next(index);
    this.isOpenSubject.next(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpenSubject.next(false);
    document.body.style.overflow = '';
  }

  next() {
    const images = this.imagesSubject.value;
    const currentIndex = this.currentIndexSubject.value;
    if (currentIndex < images.length - 1) {
      this.currentIndexSubject.next(currentIndex + 1);
    }
  }

  previous() {
    const currentIndex = this.currentIndexSubject.value;
    if (currentIndex > 0) {
      this.currentIndexSubject.next(currentIndex - 1);
    }
  }

  getCurrentImage(): LightboxImage | null {
    const images = this.imagesSubject.value;
    const index = this.currentIndexSubject.value;
    return images[index] || null;
  }
}