import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Maze } from './maze.controller';
import { ActionType, ActionResult } from 'src/models/Action.model';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent extends Maze implements OnInit {

  height : number;
  width : number;

  @ViewChild('mazeCanvas', {static : true}) canvas : ElementRef;

  stateSize : number = 50;

  constructor() {

    super();

  }

  ngOnInit() {
    this.height = this.height || 3;
    this.width = this.width || 4;
    this.init(this.width, this.height);
    this.draw();
  }


  public generateMaze(difficulty: number){

    var blockedStates : number[] = [];
    var positiveExitStates : number[] = [];
    var negativeExitStates : number[] = [];
    var movementCost = 0;
    var positiveReward = 10;
    var negativeReward = -10;

    if(difficulty === 1){
      this.width = 4;
      this.height = 3;
      blockedStates = [5];
      positiveExitStates = [3];
      negativeExitStates = [7];
    }
    if(difficulty === 2){
      this.width = 8;
      this.height = 6;
      blockedStates = [9, 11, 14, 24, 26, 27,  28, 29, 31, 42, 45];
      positiveExitStates = [19];
      negativeExitStates = [10];
    }
    if(difficulty === 3){
      this.width = 16;
      this.height = 12;
      blockedStates = [2,3,8,10,24,26,28,29,30,35,36,37,38,49,53,57,73,75,76,77,82,83,84,89,92,100,102,105,110,11,112,113,114,116,118,134,137,139,140,146,153,162,171,174,175,178,180,181,182,184,185];
      positiveExitStates = [93];
      negativeExitStates = [69,121,138,108,191];
    }

    this.build(0)
      .setBlockedStates(blockedStates)
      .setExitStates(positiveExitStates, positiveReward)
      .setExitStates(negativeExitStates, negativeReward)
      .resetPlaver();

    this.resetPlaver();

    this.draw();

  }


  public restart(){
    this.resetPlaver();
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

  public draw(){

    const canvasEl : HTMLCanvasElement = this.canvas.nativeElement;

    canvasEl.width = (this.width * this.stateSize + 50);
    canvasEl.height = (this.height * this.stateSize + 50);

    const cx = canvasEl.getContext("2d"); 

    cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);


    cx.strokeStyle = "#000000";
    cx.fillStyle = "#000000";

    for(var state of this.states){

      if(!state.isValid){
        cx.fillStyle = "#d6d8db";

        cx.fillRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

        cx.fillStyle = "#000000"

      }

      if(state.isNegativeExit){
        cx.fillStyle = "#f5c6cb";

        cx.fillRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

        cx.fillStyle = "#000000"

      }

      if(state.isPositiveExit){
        cx.fillStyle = "#c3e6cb";

        cx.fillRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

        cx.fillStyle = "#000000"

      }

      if(state.x === this.currentPosition.x && state.y === this.currentPosition.y){

        cx.fillStyle = "#b8daff";

        cx.fillRect(25 + state.x * this.stateSize + this.stateSize * .25, 25 + state.y * this.stateSize + this.stateSize * .25, this.stateSize * .5, this.stateSize * .5);

        cx.fillStyle = "#000000"

      } 


      cx.strokeRect(25 + state.x * this.stateSize, 25 + state.y * this.stateSize, this.stateSize, this.stateSize);

      // cx.fillText(state.index + "", 50 + state.x * this.stateSize, 50 + state.y * this.stateSize)

    }

  }

  /**
   * Draws the values calculated for each state
   *
   * @param {number[]} values
   * @memberof MazeComponent
   */
  public drawValues( values : number[]): void{

    const canvasEl : HTMLCanvasElement = this.canvas.nativeElement;
    var cx = canvasEl.getContext("2d");

    cx.fillStyle = "#000000";

    values.forEach( (value, i) => {

      var x = i % this.width * this.stateSize + 50 -  this.stateSize / 4 + 3;
      var y = Math.floor(i / this.width) * this.stateSize + 50 + 3;

      var shortVal : string = (Math.round(value * 100) / 100) + "";

      cx.fillText(shortVal, x, y);

    });
  }

  /**
   * Draws arrows to visualize which action is taken in a given state
   * 
   * @param {ActionType[]} types
   * @memberof MazeComponent
   */
  public drawActions( types : ActionType[]): void{


    const canvasEl : HTMLCanvasElement = this.canvas.nativeElement;
    var cx = canvasEl.getContext("2d");
    cx.fillStyle = "#000000";

    const rotationByAction = {
      "up" : 0,
      "right" : Math.PI * .5,
      "down" : Math.PI * 1,
      "left" : Math.PI * 1.5,
    }

    types.forEach( (type, i) => {

      if(type === ActionType.Exit){
        return;
      }

      var x = i % this.width * this.stateSize + 50;
      var y = Math.floor(i / this.width) * this.stateSize + 50;

      console.log("x,y : ", x, y);

      cx.translate(x,y);
      cx.rotate(rotationByAction[type]);
      cx.beginPath();
      cx.moveTo(0, -this.stateSize * .3);
      cx.lineTo(5, - this.stateSize * .3);
      cx.lineTo(0, -5 - this.stateSize * .3);
      cx.lineTo(-5, - this.stateSize * .3);
      cx.fill();
      cx.closePath();
      cx.rotate(-rotationByAction[type]);
      cx.translate(-x,-y);

    })

  }


}
