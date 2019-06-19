import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Action, ActionType } from 'src/models/Action.model';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  @Input('action') action : Action;

  icon : string;
  @Output() choose : EventEmitter<ActionType> = new EventEmitter();


  constructor() {
  }

  ngOnInit() {

    if(this.action.type === ActionType.Exit){
      this.icon = "door-open";
    } else {
      this.icon = "arrow-" + this.action.type;
    }

  }

  public chooseAction(): void{

    this.choose.emit(this.action.type);
    console.log("Picked Action: ", this.action.type);

  }

}
