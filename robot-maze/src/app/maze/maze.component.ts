import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Maze } from './maze.controller';
import { ActionType, ActionResult } from 'src/models/Action.model';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent extends Maze implements OnInit {

  @Input() height : number;
  @Input() width : number;

  @ViewChild('mazeCanvas', {static : true}) canvas : ElementRef;

  stateSize : number = 50;

  constructor() {

    super();

  }

  ngOnInit() {

    this.init(this.width, this.height);
    this.draw();

  }

  public pickAction(actionType : ActionType): ActionResult{

    var actionIndex = this.availableActions.findIndex( (action) => action.type === actionType);

    if(actionIndex === -1){
      console.log(`Key unavailable [pickAction]: actionType ${actionType} not part of availableActions`);
      return;
    } else {
      var actionResult = this.doAction(actionIndex);
      console.log("Action result: ", actionResult);
      this.availableActions = this.states[this.positionToIndex(this.currentPosition)].availableActions;
      if(actionResult.completed){
        this.draw();
      }
      return actionResult;
    }

  }

  draw(){

    const canvasEl : HTMLCanvasElement = this.canvas.nativeElement;

    canvasEl.width = (this.width * this.stateSize + 50);
    canvasEl.height = (this.height * this.stateSize + 50);

    const cx = canvasEl.getContext("2d"); 

    cx.strokeStyle = "#000000";
    cx.fillStyle = "#000000"

    for(var state of this.states){

      if(state.x === this.currentPosition.x && state.y === this.currentPosition.y){

        cx.fillStyle = "#70E542";

        cx.fillRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

        cx.fillStyle = "#000000"

      } 

      if(!state.isValid){
        cx.fillStyle = "#AAAAAA";
        
        cx.fillRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

        cx.fillStyle = "#000000"

      }


      cx.strokeRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

      cx.fillText(state.index + "", 50 + state.x * this.stateSize, 50 + state.y * this.stateSize)

    }


  }


}
