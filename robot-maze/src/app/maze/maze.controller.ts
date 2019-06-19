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
  private transitionModels : TransitionModel[];
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
        .setExitStates([7], -10);
    
    this.currentPosition = {x : 0, y : height - 1 };

    this.availableActions = this.states[this.positionToIndex(this.currentPosition)].availableActions;
  }

  private build(navigationReward : number): Maze{

    for( var y = 0; y < this.height; y++){
      for( var x = 0; x < this.width; x++){
        this.states.push({
          x : x,
          y : y,
          index : y * this.width + x,
          availableActions : Action.AllNavigationActions(),
          isValid : true
        });
        this.transitionModels.push(
          TransitionModel.simpleNavigationTransitionModel(navigationReward)
        )
      }
    }

    return this;

  }

  private setBlockedStates( stateIndeces: number[]): Maze{

    for( var index of stateIndeces){
      this.states[index].availableActions = [];
      this.states[index].isValid = false;

      this.transitionModels[index] = null;
    }

    return this;

  }

  private setExitStates(stateIndeces: number[], reward : number): Maze{

    for( var index of stateIndeces){
      this.states[index].availableActions = Action.GetExitAction( );

      this.transitionModels[index] = TransitionModel.simpleExitTransitionModel(reward);
    }

    return this;

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
      var navResult : boolean;
      switch(transition.actionType){
        case ActionType.MoveUp : 
          navResult = this.moveUp();
          break;
        case ActionType.MoveRight : 
          navResult = this.moveRight();
          break;
        case ActionType.MoveDown : 
          navResult = this.moveDown();
          break;
        case ActionType.MoveLeft : 
          navResult = this.moveLeft();
          break;
      }
      return {
        reward: transition.reward,
        nextState: this.positionToIndex(this.currentPosition),
        completed: navResult
      }      
    }

  }

  private moveUp(): boolean {

    var tempx = (this.currentPosition.x);
    var tempy = (this.currentPosition.y) - 1;
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      this.currentPosition.y = tempy;
      return true;
    }

    return false;

  }
  
  private moveDown(): boolean {

    var tempx = (this.currentPosition.x);
    var tempy = (this.currentPosition.y) + 1;
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      this.currentPosition.y = tempy;
      return true;
    }

    return false;

  }

  private moveLeft(): boolean {

    var tempx = (this.currentPosition.x) - 1;
    var tempy = (this.currentPosition.y);
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempx < 0 || tempx >= this.width || tempy < 0 || tempy >= this.height){
      return false;
    }

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      this.currentPosition.x = tempx;
      return true;
    }

    return false;
    
  }

  private moveRight(): boolean {

    var tempx = (this.currentPosition.x) + 1;
    var tempy = (this.currentPosition.y);
    var tempIndex = this.positionToIndex(tempx, tempy);

    if(tempIndex >= 0 && tempIndex < this.states.length && this.states[tempIndex].isValid){
      this.currentPosition.x = tempx;
      return true;
    }

    return false;
    
  }

  public positionToIndex(xOrPos: Position | number, y? : number): number {
    if( typeof xOrPos === "object"){
      return xOrPos.x + xOrPos.y * this.width;
    } else {
      return xOrPos + y * this.width
    }
  }



}