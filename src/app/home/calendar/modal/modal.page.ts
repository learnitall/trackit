import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() event: CalendarEvent;

  public eventEditForm: FormGroup;
  public submitAttempt: boolean = false;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder
  ) { 
    this.eventEditForm = formBuilder.group({
      name: [
        'New Event',
        Validators.required
      ],
      color: [
        '',
        Validators.required
      ],
      notes: [
        ''
      ]
    })
  }

  ngOnInit() {
  }

  onChangeColor(color: string) {
    this.eventEditForm.patchValue({ color });
  }

  save() {
    this.submitAttempt = true;
    if (this.eventEditForm.valid) {
      console.log("valid")
    } else {
      console.log("invalid")
    }
  }

}
