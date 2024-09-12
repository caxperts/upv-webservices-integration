import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { WebstreamingComponent } from './webstreaming.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { UpvWebInterface } from '@caxperts/webrtc';

/**
 * Creates the webstreaming component and gives ability to move a already running stream to a different target location
 */
@Injectable({
  providedIn: 'root'
})
export class WebstreamingCreatorService {

  private _componentFactory: ComponentFactory<WebstreamingComponent>;
  private _componentRef: ComponentRef<WebstreamingComponent>;

  container: ViewContainerRef;
  sizeRelay = new Subject<any>();
  sub: Subscription;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  attach(newContainer: ViewContainerRef, size: Observable<any>, upvApi: UpvWebInterface, model: string) {

      if (!this._componentRef) {
          this._componentFactory = this._componentFactoryResolver.resolveComponentFactory(WebstreamingComponent);
          this._componentRef = newContainer.createComponent(this._componentFactory);
          this._componentRef.instance.size = this.sizeRelay.asObservable();
          this._componentRef.instance.upvApi = upvApi;
          this._componentRef.instance.model = model;
          this._componentRef.changeDetectorRef.detectChanges();
      } else {
          let index = this.container.indexOf(this._componentRef.hostView);
          this.container.detach(index);
          newContainer.insert(this._componentRef.hostView);
      }
      this.container = newContainer;
      if(this.sub){
          this.sub.unsubscribe();
      }
      this.sub = size.subscribe(s => this.sizeRelay.next(s));
  }
}
