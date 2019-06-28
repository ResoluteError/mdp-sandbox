import { State } from 'src/models/State.model';
import { Action } from 'src/models/Action.model';
import { ValueFunction } from 'src/models/ValueFunction.model';

export class SimpleValue implements ValueFunction {

  currentState : State;

  constructor(state: State, actions: Action[], nextStates : State[]){
    this.currentState = state;
  }

  stateValue(): number{
    return 0;
  }

  qValue( pickedAction : Action): number{
    return 0;
  }

}