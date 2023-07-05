import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog'
import { ElementRef, Renderer2 } from '@angular/core';
import { ScanOptionsService} from '../../services/scan-options.service';
import { ModalService} from '../../services/modal.service';
import { ResourcestringService} from '../../services/resourcestring.service';
import {FileFormat, FileFormatOption,resourceString} from '../../model/global';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {ComponentRef, EmbeddedViewRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'


@Component({
  selector: 'app-feature-popover',
  templateUrl: './feature-popover.component.html',
  styleUrls: ['./feature-popover.component.less']
})
export class FeaturePopoverComponent implements OnInit {

  

    fileFormat : FileFormat;
    fileFormatOption : FileFormatOption[];
    from : any;
    resourceString : resourceString[];
    scrollBarsFixed = false;

    @Output() objectSelected = new EventEmitter<any>();
    @Input() feature: any;
    @Input() event: MouseEvent;

    const_fileFormat : string = "fileFormat";
    const_type : string = "type";
    const_size : string = 'size';
    selectedFileFormat : FileFormat;
    selectedType : FileFormat;
    selectedSize : FileFormat;
    anyFileFormat = {from : 'fileFormat'};
    anyType = {from : 'type'};
    anySize = {from : 'size'};
    selectedFileFormatOption: FileFormatOption;
    selectedTypeOption: FileFormatOption;
    selectedSizeOption: FileFormatOption; 
    selectedOption : FileFormatOption;

    constructor(
                private scanOptionsService : ScanOptionsService, 
                private modalService : ModalService,
                private resourceStringService : ResourcestringService,
                public mtModalRef : MatDialogRef<any>,
                private elementRef: ElementRef,
                private renderer: Renderer2
              )
              {
                
              }

    ngOnInit(){
      this.resourceString = this.resourceStringService.getObjStrings();

      this.modalService.currentValue.subscribe((data) =>{
        this.from = data;
      });
      this.fileFormat = this.scanOptionsService.getFileFormat(this.from);
      this.fileFormatOption = this.fileFormat.options;

      if(this.from.from == this.const_fileFormat)
      {
        this.selectedFileFormat = this.scanOptionsService.getFileFormat(this.anyFileFormat);
        this.selectedFileFormatOption = this.selectedFileFormat.options.find(item => item.isDefault === true);
      }
      else if (this.from.from == this.const_type){
        this.selectedType = this.scanOptionsService.getFileFormat(this.anyType);
       this.selectedTypeOption = this.selectedType.options.find(item => item.isDefault === true);
      }
      else if (this.from.from == this.const_size){
        this.selectedSize = this.scanOptionsService.getFileFormat(this.anySize);
        this.selectedSizeOption = this.selectedSize.options.find(item => item.isDefault === true);
      }
      
      this.scanOptionsService.selectedFileFormatC.subscribe(object =>{
        if(object){
          this.selectedFileFormatOption = object;
          
        }
      })

      this.scanOptionsService.selectedTypeC.subscribe(type =>{
        if(type){
          this.selectedTypeOption = type;
        }
      })

      this.scanOptionsService.selectedSizeC.subscribe(size =>{
        if(size){
          this.selectedSizeOption = size;
        }
      })
    }

    //default selection
    getNgClass(option: any): any{

      if(this.from.from == this.const_fileFormat)
        {
          return { selected : option === this.selectedFileFormatOption };
        }
        else if (this.from.from == this.const_type){
          return { selected : option === this.selectedTypeOption };
        }
        else if (this.from.from == this.const_size){
          return { selected : option === this.selectedSizeOption};
        }
      return ;
    }

    //when an option is selected
    selectOption(option : any){
      this.selectOption = option;
      this.scanOptionsService.setSelectedOption(option,this.from);
      this.objectSelected.emit(option);
      this.modalService.closeModal(this.mtModalRef);
      
      //this.showPopover();
    }

    closeModal():void{
      this.modalService.closeModal(this.mtModalRef);
    }
    
    showPopover() {
      const name = this.feature.name;
      const options: any = {}; 
  
      
      //this.showPopoverHelper(this.event, options);
    }
    
    
}
