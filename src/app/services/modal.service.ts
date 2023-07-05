import { Injectable, InjectionToken, Injector, TemplateRef, ElementRef } from '@angular/core';
import { ComponentType, Overlay, OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {MatDialog,MatDialogRef,MatDialogConfig,DialogPosition} from '@angular/material/dialog';
import { ProgressAlertComponent} from '../views/progress-alert/progress-alert.component'; 
import {AppComponent} from '../app.component';
import { BehaviorSubject, timer} from 'rxjs';
import {AppModule} from '../../app/app.module';
import { PopoverConfig } from '../../app/model/scantemplate.model';
import { PopoverRef } from '../views/feature-popover/popover-ref';
import { PopoverComponent } from '../views/popover/popover.component';

export const POPOVER_DATA = new InjectionToken('popover.data');

const defaultConfig: PopoverConfig = {
  backdropClass: '',
  disableClose: false,
  panelClass: '',
  arrowOffset: 30,
  arrowSize: 20
};

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  deviceInformation:any;
  isThirdGenBrowser : boolean = AppModule.isThirdGenBrowser;

  private fromData = new BehaviorSubject<string>('');
  currentValue = this.fromData.asObservable();

  constructor(
    public dialog : MatDialog,
    public  app : AppComponent,
    private overlay: Overlay,
    private injector: Injector   
    ) {}
  

  private centerDialog(dialogElement: HTMLElement): DialogPosition {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dialogWidth = dialogElement.offsetWidth;
      const dialogHeight = dialogElement.offsetHeight;
    
      const topPosition = Math.max(0, (viewportHeight - dialogHeight) / 2);
      const leftPosition = Math.max(0, (viewportWidth - dialogWidth) / 2);
    
      return { top: topPosition + 'px', left: leftPosition + 'px' };
    }
    

  showProgressAlert(title: string, message : string):MatDialogRef<ProgressAlertComponent>{
    
    return this.dialog.open(ProgressAlertComponent, {
      data :{'title': title,'message':message},
      //panelClass: (!this.isThirdGenBrowser) ? 'allow-outside-interaction' : 'allow-outside-banner-interaction'
      //panelClass:'progress-bar-modalbox'
      
    });
  }

  closeModal(modalRef :MatDialogRef<any>){
    if(modalRef){
      modalRef.close();
    }
   }

  public openLargeModal(component : any):void{

    const dialogElement = document.querySelector('.scroll-container') as HTMLElement;
    const position = this.centerDialog(dialogElement);
    const dialogRef =
      this.dialog.open(component, {
        /* position: {
          left:'15vw',
          top:'10vh',
          right:'20vh'
        },
        panelClass:'makeItMiddle', */
        data:{closeBtnName:'Close'},
        hasBackdrop : false,
        disableClose:true
      });
  }

  public openModalWithoutClose(component : any,title: string,message : string)
  {
    return this.dialog.open(component, {
      data :{'title': title,'message':message},     
    });

  }

  setData(data:any){
    this.fromData.next(data);
  }

  public openModal(component : any,dialog_postion:any){
    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    let dialogRef = this.dialog.open(component,{
      position: dialog_postion,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
    return dialogRef;
  }
  
  public openModalWithTitle(component : any,title: string,message : string){

    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    return  this.dialog.open(component, {
      data :{'title': title,'message':message},
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      // height: '100%',
      // width: '100%'
    });

  }


  public showAlert(component : any,title: string,message : string)
  {

     this.dialog.open(component, {
      data :{'title': title,'message':message}
    });

    timer(3000).subscribe(()=>{
      this.dialog.closeAll();
    })
  }

  public closeAllModals()
  {
    this.dialog.closeAll();
  }

  public openComponentModal(component: any,data:any)
  {
    this.dialog.closeAll();
    this.dialog.open(component, {
      data : data
    });
  }

  open<D = any>(componentOrTemplate: ComponentType<any> | TemplateRef<any>,
    target: ElementRef | HTMLElement,
    config: Partial<PopoverConfig> = {}): PopoverRef<D> {
  const popoverConfig: PopoverConfig = Object.assign({}, defaultConfig, config);
  console.log("Open  Function modal service "+target +":" + config);
  const arrowSize = popoverConfig.arrowSize;
  const arrowOffset = popoverConfig.arrowOffset;
  const panelOffset = arrowSize / 2;

  // preferred positions, in order of priority
  const positions: ConnectionPositionPair[] = [
    // top center
    {
      overlayX: 'center',
      overlayY: 'bottom',
      originX: 'center',
      originY: 'top',
      panelClass: ['bottom', 'center'],
      offsetY: -1 * panelOffset
    },
    // top left
    {
      overlayX: 'start',
      overlayY: 'bottom',
      originX: 'center',
      originY: 'top',
      panelClass: ['bottom', 'left'],
      offsetX: -1 * arrowOffset,
      offsetY: -1 * panelOffset
    },
    // top right
    {
      overlayX: 'end',
      overlayY: 'bottom', 
      originX: 'center',
      originY: 'top',
      panelClass: ['bottom', 'right'],
      offsetX: arrowOffset,
      offsetY: -1 * panelOffset
    },
    // bottom center
    {
      overlayX: 'center',
      overlayY: 'top',
      originX: 'center',
      originY: 'bottom',
      panelClass: ['top', 'center'],
      offsetY: panelOffset
    },
    // bottom left
    {
      overlayX: 'start',
      overlayY: 'top',
      originX: 'center',
      originY: 'bottom',
      panelClass: ['top', 'left'],
      offsetX: -1 * arrowOffset,
      offsetY: panelOffset
    },
    // bottom right
    {
      overlayX: 'end',
      overlayY: 'top',
      originX: 'center',
      originY: 'bottom',
      panelClass: ['top', 'right'],
      offsetX: arrowOffset,
      offsetY: panelOffset
    }
  ];

  console.log("Open modal service "+ positions.toString);

  const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(target)
      .withPush(false)
      .withFlexibleDimensions(false)
      .withPositions(positions);

  const overlayRef = this.overlay.create({
    hasBackdrop: true,
    backdropClass: config.backdropClass,
    panelClass: config.panelClass,
    positionStrategy,
    scrollStrategy: this.overlay.scrollStrategies.reposition()
  });

  const popoverRef = new PopoverRef(overlayRef, positionStrategy, popoverConfig);

  const injector = Injector.create({
    parent: this.injector,
    providers: [
      { provide: PopoverRef, useValue: popoverRef },
      { provide: POPOVER_DATA, useValue: config.data },
    ],
  });

  const popover = overlayRef.attach(new ComponentPortal(
    PopoverComponent,
    null,
    injector
  )).instance;

  if (componentOrTemplate instanceof TemplateRef) {
    // rendering a provided template dynamically
    popover.attachTemplatePortal(
      new TemplatePortal(
        componentOrTemplate,
        null,
        {
          $implicit: config.data,
          popover: popoverRef
        }
      )
    );
  } else {
    // rendering a provided component dynamically
    popover.attachComponentPortal(
      new ComponentPortal(
        componentOrTemplate,
        null,
        injector
      )
    );

  }

  return popoverRef;
}
}

