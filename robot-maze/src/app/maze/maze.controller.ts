import { Position } from 'src/models/Robot.model';
import { State } from 'src/models/State.model';
import { Action, ActionType, ActionResult } from 'src/models/Action.model';
import { TransitionModel, Transition } from 'src/models/Transition.model';

export class Maze {

  height: number;
  width: number;
  states : State[];
  currentPosition : Position;
  availableActions : Action[] = [];
  transitionModels : TransitionModel[];
  isCompleted : boolean;
  lastReward : number;

  constructor(){
    this.currentPosition = {
      x : 0,
      y : 0
    }
    this.states = [];
    this.transitionModels = [];
    this.isCompleted = false;
    this.lastReward = 0;
  }

  public init(width: number, height: number){

    this.width = width;
    this.height = height;

    this.build(0)
        .setBlockedStates([5])
        .setExitStates([3], 10)
        .setExitStates([7], -10)
        .resetPlaver();
    
    this.currentPosition = {x : 0, y : height - 1 };

    this.availableActions = this.states[this.positionToIndex(this.currentPosition)].availableActions;
  }

  public build(navigationReward : number): Maze{

    this.states = [];
    this.transitionModels = [];
    this.availableActions = [];

    for( var y = 0; y < this.height; y++){
      for( var x = 0; x < this.width; x++){
        this.states.push({
          x : x,
          y : y,
          index : y * this.width + x,
          availableActions : Action.AllNavigationActions(),
          isValid : true,
          isNegativeExit: false,
          isPositiveExit: false
        });
        this.transitionModels.push(
          TransitionModel.simpleNavigationTransitionModel(navigationReward)
        )
      }
    }

    return this;

  }

  public setBlockedStates( stateIndeces: number[]): Maze{

    for( var index of stateIndeces){
      this.states[index].availableActions = [];
      this.states[index].isValid = false;

      this.transitionModels[index] = null;
    }

    return this;

  }

  public setExitStates(stateIndeces: number[], reward : number): Maze{

    for( var index of stateIndeces){
      this.states[index].availableActions = Action.GetExitAction( );
      if(reward > 0){
        this.states[index].isPositiveExit = true;
      } else {
        this.states[index].isNegativeExit = true;
      }
      this.transitionModels[index] = TransitionModel.simpleExitTransitionModel(reward);
    }

    return this;

  }

  resetPlaver(){
  
    this.currentPosition = {x : 0, y : this.height - 1};
    this.availableActions = this.states[this.positionToIndex(this.currentPosition)].availableActions;
    this.isCompleted = false;
    this.lastReward = 0;
    
  }

  public doAction(actionIndex : number): ActionResult{

    if(actionIndex < 0 || actionIndex > this.availableActions.length){
      console.log(`Out of bounds Error [doAction]: actionIndex ${actionIndex} not in availableActions`);
      return null;
    }

    var action = this.availableActions[actionIndex];
    var currentIndex = this.positionToIndex(this.currentPosition);
    var relevantTransition = this.transitionModels[currentIndex][action.type];

    var transition = Transition.exec(relevantTransition);
    this.lastReward = transition.reward;

    if(transition.actionType === ActionType.Exit){
      this.isCompleted = true;
      this.availableActions = [];
      return {
        reward: transition.reward,
        nextState: -1,
        completed: true
      }
    } else {
      var newPosition : Position;
      switch(transition.actionType){
        case ActionType.MoveUp : 
          newPosition = this.moveUp(this.currentPosition);
          break;
        case ActionType.MoveRight : 
          newPosition = this.moveRight(this.currentPosition);
          break;
        case ActionType.MoveDown : 
          newPosition = this.moveDown(this.currentPosition);
          break;
        case ActionType.MoveLeft : 
          newPosition = this.moveLeft(this.currentPosition);
          break;
      }
      var changedPositions : boolean = false;
      if( newPosition.x !== this.currentPosition.x || newPosition.y !== this.currentPosition.y){
        changedPositions = true;
        this.currentPosition = newPosition;
      }
      return {
        reward: transition.reward,
        nextState: this.positionToIndex(this.currentPosition),
        completed: changedPositions
      }      
    }

  }

  public moveUp(currentPosition : Position): Position {

    var tempx = (currentPosition.x);
    var tempy = (currentPosition.y) - 1;
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempx < 0 || tempx >= this.width || tempy < 0 || tempy >= this.height){
      return currentPosition;
    }

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      return {
        x : tempx,
        y : tempy
      }
    }

    return currentPosition;

  }
  
  public moveDown(currentPosition : Position): Position {

    var tempx = (currentPosition.x);
    var tempy = (currentPosition.y) + 1;
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempx < 0 || tempx >= this.width || tempy < 0 || tempy >= this.height){
      return currentPosition;
    }

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      return {
        x : tempx,
        y : tempy
      }
    }

    return currentPosition;
  }

  public moveLeft(currentPosition : Position): Position {

    var tempx = (currentPosition.x) - 1;
    var tempy = (currentPosition.y);
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempx < 0 || tempx >= this.width || tempy < 0 || tempy >= this.height){
      return currentPosition;
    }

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      return {
        x : tempx,
        y : tempy
      }
    }

    return currentPosition;
  }

  public moveRight(currentPosition : Position): Position {

    var tempx = (currentPosition.x) + 1;
    var tempy = (currentPosition.y);
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempx < 0 || tempx >= this.width || tempy < 0 || tempy >= this.height){
      return currentPosition;
    }

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      return {
        x : tempx,
        y : tempy
      }
    }

    return currentPosition;
  }

  public positionToIndex(xOrPos: Position | number, y? : number): number {
    if( typeof xOrPos === "object"){
      return xOrPos.x + xOrPos.y * this.width;
    } else {
      return xOrPos + y * this.width
    }
  }



}