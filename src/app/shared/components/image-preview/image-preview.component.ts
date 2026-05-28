import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PreviewImage {
  url: string;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnChanges {
  @Input() imageUrl = '';
  @Input() imageTitle = '';
  @Input() imageDescription = '';
  @Input() visible = false;
  @Input() images: PreviewImage[] = [];
  @Input() currentIndex = 0;
  @Output() closed = new EventEmitter<void>();
  @Output() indexChanged = new EventEmitter<number>();

  activeIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.activeIndex = this.currentIndex;
    } else if (changes['currentIndex']) {
      this.activeIndex = this.currentIndex;
    }
  }

  get currentImage(): PreviewImage | null {
    if (this.images && this.images.length > 0) {
      const idx = Math.max(0, Math.min(this.activeIndex, this.images.length - 1));
      return this.images[idx];
    }
    return null;
  }

  get activeUrl(): string {
    const curr = this.currentImage;
    return curr ? curr.url : this.imageUrl;
  }

  get activeTitle(): string {
    const curr = this.currentImage;
    return curr ? curr.title : this.imageTitle;
  }

  get activeDescription(): string {
    const curr = this.currentImage;
    return curr ? curr.description || '' : this.imageDescription;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible) this.closed.emit();
  }

  @HostListener('document:keydown.arrowRight')
  onArrowRight(): void {
    if (this.visible && this.images && this.images.length > 1) {
      this.next();
    }
  }

  @HostListener('document:keydown.arrowLeft')
  onArrowLeft(): void {
    if (this.visible && this.images && this.images.length > 1) {
      this.prev();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('ip-backdrop') || target.classList.contains('ip-image-wrapper') || target.classList.contains('ip-carousel-container')) {
      this.closed.emit();
    }
  }

  prev(event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.images || this.images.length <= 1) return;
    this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    this.indexChanged.emit(this.activeIndex);
  }

  next(event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.images || this.images.length <= 1) return;
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
    this.indexChanged.emit(this.activeIndex);
  }

  selectIndex(index: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.activeIndex = index;
    this.indexChanged.emit(this.activeIndex);
  }
}

