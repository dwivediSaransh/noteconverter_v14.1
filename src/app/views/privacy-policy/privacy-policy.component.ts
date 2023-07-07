import { Component,OnInit,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService} from '../../services/modal.service';
import { environment } from '../../../environments/environment'
import { ProgressAlertComponent } from '../progress-alert/progress-alert.component';
import { ResourcestringService} from '../../services/resourcestring.service';
import { resourceString} from '../../model/global';
import { LogService } from '../../services/log.service';
import smoothscroll from 'smoothscroll-polyfill';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.less']
})
export class PrivacyPolicyComponent implements OnInit {

  privacyPolicy : string = '';
  showVersion: string = '';
  env = environment;
  resourceString : resourceString[];
  private startY: number; 
  private startScrollTop: number; 
  private isScrolling: boolean;
  testELement = document.getElementsByClassName('popup-content'); 
  //declare smoothscroll : any;

  constructor(
    private http: HttpClient,
    private modalService : ModalService,
    public modalRef : MatDialogRef<any>,
    private resourceStringService : ResourcestringService,
    private  logService: LogService,
    private elementRef: ElementRef,
    ){}

  ngOnInit(): void {
    //alert(this.testELement[0].classList.toggle("responsive"));
    //debugger;
    const progress =  this.modalService.openModalWithoutClose(ProgressAlertComponent,'','') //this.modalService.showProgressAlert('Alert','');
    const url = this.env.privacyPolicyUrl;
    //this.smoothscroll.polyfill();
    //smoothscroll.polyfill();
   
    //const element = document.getElementById('privacyContent');
    
    //element.scrollIntoView({behavior : 'smooth'});
    //alert(element.innerHTML);
    this.http.get(url, {responseType:'text'})
      .subscribe({
          next:(response) => {
          this.privacyPolicy = (response as string);
          //this.showVersion = this.resourceString["VERSION"];
          progress.close();
        },
        error:(error) => {
          this.logService.trackTrace("inside privacy policy error"+error);
          this.showVersion = 'v1.0'; //this.strings.VERSION
          progress.close();
          //this.modalService.showGeneralError(error);
        }
    });

    }
      
    closeModal():void{
      this.modalService.closeModal(this.modalRef);
    }

    /* private disableLinks(): void {
      const links = document.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        links[i].style.pointerEvents = 'none';
      }
    } */
  /* disableLinks() :void{
    const links  = this.el.nativeElement.querySelectorAll('a');
     links.array.forEach(link => {
      this.renderer.setStyle(link,'pointer-events','none');
    });
  } */

  //////////// touch events

onTouchStart(event: MouseEvent | TouchEvent) 
{ 
  event.preventDefault(); //alert("touch start");
  this.startY = this.getTouchY(event); 
  this.startScrollTop = this.testELement[0].scrollTop; alert(this.testELement[0].innerHTML);
  this.isScrolling = true; 
} 
onTouchMove(event: MouseEvent | TouchEvent) { 
  event.preventDefault(); 
  if (!this.isScrolling) return; 
  const touchY = this.getTouchY(event); 
  const scrollDelta = 50;//this.startY - touchY; //alert(scrollDelta);
  this.testELement[0].scrollTop = this.startScrollTop + scrollDelta; 
} 
onTouchEnd() { 
  //alert("touch end");
  this.isScrolling = false; 
} 

private getTouchY(event: MouseEvent | TouchEvent): number { 
  if (event instanceof TouchEvent) { 
    return event.touches[0].clientY;
  } else { 
    return event.clientY; 
  } 
} 
}
  


