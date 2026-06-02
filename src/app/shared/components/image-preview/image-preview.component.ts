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

  // Zoom and Pan state
  scale = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.activeIndex = this.currentIndex;
      this.resetZoom();
    } else if (changes['currentIndex']) {
      this.activeIndex = this.currentIndex;
      this.resetZoom();
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
    if (this.visible) this.closePreview();
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
      this.closePreview();
    }
  }

  closePreview(): void {
    this.closed.emit();
    setTimeout(() => this.resetZoom(), 300); // reset after animation
  }

  prev(event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.images || this.images.length <= 1) return;
    this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    this.resetZoom();
    this.indexChanged.emit(this.activeIndex);
  }

  next(event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.images || this.images.length <= 1) return;
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
    this.resetZoom();
    this.indexChanged.emit(this.activeIndex);
  }

  selectIndex(index: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.activeIndex = index;
    this.resetZoom();
    this.indexChanged.emit(this.activeIndex);
  }

  // --- Zoom & Pan Logic ---

  resetZoom(event?: Event): void {
    if (event) event.stopPropagation();
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  zoomIn(event?: Event): void {
    if (event) event.stopPropagation();
    this.scale = Math.min(this.scale + 0.5, 5); // Max zoom 5x
  }

  zoomOut(event?: Event): void {
    if (event) event.stopPropagation();
    this.scale = Math.max(this.scale - 0.5, 0.5); // Min zoom 0.5x
    if (this.scale === 1) {
      this.translateX = 0;
      this.translateY = 0;
    }
  }

  onWheel(event: WheelEvent): void {
    if (!this.visible) return;
    event.preventDefault();
    if (event.deltaY < 0) {
      this.scale = Math.min(this.scale + 0.25, 5);
    } else {
      this.scale = Math.max(this.scale - 0.25, 0.5);
    }
    
    // Auto reset pan if scale reaches 1 or below
    if (this.scale <= 1) {
      this.translateX = 0;
      this.translateY = 0;
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.scale > 1) {
      event.preventDefault(); // Prevent default dragging
      this.isDragging = true;
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }

  get imageTransform(): string {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }
}
