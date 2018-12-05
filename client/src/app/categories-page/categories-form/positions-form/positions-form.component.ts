import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Position } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  position: Position[] = [];
  loading = false;
  positionId = null;
  modal: MaterialInstance;
  form: FormGroup

  constructor(private positionService: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true;
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      this.position = positions;
      this.loading = false; 
    })
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию "${position.name}" ?`)
    if(decision) {
      this.positionService.delete(position).subscribe(
        response => {
          const idx = this.position.findIndex( p => p._id === position._id);
          this.position.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position  = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.modal.close();
          this.form.reset({name: '', cost: 1})
          this.form.enable();
    }

    if(this.positionId){
      newPosition._id = this.positionId;
      this.positionService.update(newPosition).subscribe(
        position => {
          const idx = this.position.findIndex( p => p._id === position._id);
          this.position[idx] = position;
          MaterialService.toast('Изменения сохранены');
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else{
      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана');
          this.position.push(position)
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        completed
      )
    }

    
  }

}
