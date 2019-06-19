import { ActionType } from './Action.model';

export class Transition {

  percentiles: number[]; // Must add up to 100
  actions: ActionType[];
  rewards: number[];

  static exec(transition : Transition) : TransitionResult {

    var rand = Math.floor(Math.random() * 100);
    for( var i = 0; i < transition.percentiles.length; i++){

      if(rand < transition.percentiles[i]){
        return {
          actionType : transition.actions[i],
          reward : transition.rewards[i]
        };
      }

    }

  }

}

export class TransitionModel {

  [actionType : string] : Transition;

  static simpleNavigationTransitionModel(navigationReward? : number): TransitionModel {
    return {
      "up" : {
        percentiles: [10, 90, 100],
        actions: [ActionType.MoveLeft, ActionType.MoveUp, ActionType.MoveRight],
        rewards : [navigationReward | 0, navigationReward | 0, navigationReward | 0]
      },
      "right" : {
        percentiles: [10, 90, 100],
        actions: [ActionType.MoveUp, ActionType.MoveRight, ActionType.MoveDown],
        rewards : [navigationReward | 0, navigationReward | 0, navigationReward | 0]
      },
      "down" : {
        percentiles: [10, 90, 100],
        actions: [ActionType.MoveRight, ActionType.MoveDown, ActionType.MoveLeft],
        rewards : [navigationReward | 0, navigationReward | 0, navigationReward | 0]
      },
      "left" : {
        percentiles: [10, 90, 100],
        actions: [ActionType.MoveDown, ActionType.MoveLeft, ActionType.MoveUp],
        rewards : [navigationReward | 0, navigationReward | 0, navigationReward | 0]
      },
    }
  }

  static simpleExitTransitionModel(exitReward : number): TransitionModel {
    return {
      "exit" : {
        percentiles: [100],
        actions: [ActionType.Exit],
        rewards : [exitReward]
      }
    }
  }

}

export interface TransitionResult {
  actionType : ActionType,
  reward: number;
}