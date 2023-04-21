import { Component, Input, ViewChild, Renderer2, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subscription, debounce, distinctUntilChanged, timer } from 'rxjs';
import { UpvWebInterface } from "@caxperts/webrtc";

@Component({
  selector: 'app-webstreaming',
  templateUrl: './webstreaming.component.html'
})
export class WebstreamingComponent implements AfterViewInit, OnDestroy {
  @Input() size: Observable<any>;
  @Input() upvApi: UpvWebInterface;
  @Input() model: string;
  @ViewChild('player') player: ElementRef;
  @HostListener('wheel', ['$event'])
  handleWheelEvent(event) {
    //prevent scroll event to be propagated upwards
    event.preventDefault();
  }
  @HostListener('mousedown', ['$event'])
  handleMousedown(event) {
    //prevent middle mouse click event to be propagated upwards
    if (event.which == 2) {
      event.preventDefault();
    }
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {

    if (document.activeElement.id != 'Video') {
      //no focus in stream
      return;
    }

    if (event.code == 'Enter' || event.code == 'Space' || event.code == 'Tab' || event.code == 'ControlLeft' || event.code == 'ControlRight') {
      event.preventDefault();
    }
  }

  height: 0;
  width: 0;
  private videoConfigProvider = new SplitVideoConfigProvider();

  subscriptions: Subscription[] = [];

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {

      let sub = this.size
        .pipe(
          debounce(() => timer(1000)),
          distinctUntilChanged((prev, curr) => prev.width === curr.width && prev.height === curr.height)
        )
        .subscribe(size => {
          if (size == null) {
            return;
          }

          if(diff(this.videoConfigProvider.videoSize.x, size.width) > 5 || diff(this.videoConfigProvider.videoSize.y, size.height) > 5){
            this.width = size.width;
            this.height = size.height;
            this.handleResize();
          }
        });

      this.subscriptions.push(sub);

      this.upvApi.onconnectingfailed = (message, details) => {
        let m = 'Connecting to browser based viewing failed: ' + message;
        console.log(m, details);
      }
      this.upvApi.videoConfigProvider = this.videoConfigProvider;

      this.upvApi.connect(this.model, '', this.player.nativeElement);
  }

  ngOnDestroy(): void {
    this.upvApi.onconnectingfailed = (m, d) => { };
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleResize() {
    let element = document.getElementById('Video');

    if (element != null) {
      this.renderer.setStyle(element, 'width', this.width + 'px');
      this.renderer.setStyle(element, 'height', this.height + 'px');
      this.videoConfigProvider.videoSize.x = this.width;
      this.videoConfigProvider.videoSize.y = this.height;
    }

    var resizeEvent = window.document.createEvent('UIEvents') as any;
    resizeEvent.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);
  }
}

export function getWindowWidth(): number {
  return window.innerWidth || document.body.clientWidth;
}

export function getWindowHeight(): number {
  return window.innerHeight || document.body.clientHeight;
}

export class SplitVideoConfigProvider {

  public videoSize: any;

  constructor() {
    this.videoSize = { x: getWindowWidth(), y: getWindowHeight() };
  }

  getVideoElementWidth() {
    return this.videoSize.x;
  }

  getVideoElementHeight() {
    return this.videoSize.y;
  }
}

function diff (num1, num2) {
  if (num1 > num2) {
    return num1 - num2
  } else {
    return num2 - num1
  }
}
