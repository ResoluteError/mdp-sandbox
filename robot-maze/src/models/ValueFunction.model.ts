import { State } from './State.model';
import { Action } from './Action.model';

export interface ValueFunction {

  currentState : State;

  // The value of a state assuming the robot acts optimally
  stateValue(): number;

  // The value of a transition state given a action has been picked
  qValue( pickedAction : Action): number;

}