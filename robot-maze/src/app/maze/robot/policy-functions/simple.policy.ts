import { State } from 'src/models/State.model';
import { Action, ActionType } from 'src/models/Action.model';
import { PolicyFunction } from 'src/models/PoilcyFunction.model';

export class SimplePolicy implements PolicyFunction {

  name: string;
  currentState : State;

  constructor(name: string, state : State){

    this.name = name;
    this.currentState = state;

  }

  pickAction(): Action{

    var actions = this.currentState.availableActions;

    if(actions.length === 1){
      return actions[0];
    } else {
      var upAction = actions.findIndex( action => action.type === ActionType.MoveUp);
      if(upAction > -1){
        return actions[upAction];
      } else {
        return actions[0];
      }
    }

  }


}