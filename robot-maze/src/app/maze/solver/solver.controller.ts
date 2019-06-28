import { MazeComponent } from '../maze.component';
import { ActionType } from 'src/models/Action.model';
import { Position } from 'src/models/Robot.model';

export class Solver {


  maze: MazeComponent;
  discount: number;
  
  memo = {};
  optimalStrategy = {};

  constructor( discount : number){
    this.discount = discount;
  }

  valueIteration(stateIndex : number, k : number){

    if(typeof this.memo[stateIndex] !== "undefined" 
    && typeof this.memo[stateIndex][k] !== "undefined"){
      return this.memo[stateIndex][k];
    }

    if(k <= 0 || !this.maze.states[stateIndex].isValid){
      if(typeof this.memo[stateIndex] === "undefined"){
        this.memo[stateIndex] = {};
      }
      this.memo[stateIndex][k] = 0;
      return 0;
    }
    
    var transModel = this.maze.transitionModels[stateIndex];
    if(transModel.exit){

      if(typeof this.memo[stateIndex] === "undefined"){
        this.memo[stateIndex] = {};
      }

      this.memo[stateIndex][k] = transModel.exit.rewards[0];
      return transModel.exit.rewards[0];

    } else {

      var optimalStrategy : string;
      var maxActionVal : number = 0;

      for( var action in transModel){

        var percentiles = transModel[action].percentiles;
        var realActionTypes = transModel[action].actions;
        var rewards = transModel[action].rewards;
        var transitionVal : number = 0;

        for( var i = 0; i < percentiles.length; i++){

          var prevPercentile = i > 0 ? percentiles[i-1] : 0;
          var probability = (percentiles[i] - prevPercentile) / 100;
          var reward = rewards[i];
          var realActionType = realActionTypes[i];
          var currentPosition : Position = 
          { 
            x : this.maze.states[stateIndex].x,
            y: this.maze.states[stateIndex].y
          }
          var newPosition : Position;

          switch(realActionType){
            case ActionType.MoveUp : 
              newPosition = this.maze.moveUp(currentPosition);
              break;
            case ActionType.MoveRight : 
              newPosition = this.maze.moveRight(currentPosition);
              break;
            case ActionType.MoveDown : 
              newPosition = this.maze.moveDown(currentPosition);
              break;
            case ActionType.MoveLeft : 
              newPosition = this.maze.moveLeft(currentPosition);
              break;
          }

          var nextState = this.maze.positionToIndex(newPosition);

          var nextVal = this.valueIteration(nextState, k - 1);

          transitionVal += probability * (reward + this.discount * nextVal);

        }

        if(transitionVal > maxActionVal){
          maxActionVal = transitionVal;
          optimalStrategy = action;
        }

      }

      if(typeof this.memo[stateIndex] === "undefined"){
        this.memo[stateIndex] = {};
      }

      this.memo[stateIndex][k] = maxActionVal;
      this.optimalStrategy[stateIndex] = optimalStrategy;
      return maxActionVal;

    }

  }

}