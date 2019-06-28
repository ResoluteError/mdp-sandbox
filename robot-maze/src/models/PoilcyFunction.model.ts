import { State } from './State.model';
import { Action } from './Action.model';

export interface PolicyFunction {

  name: string;
  currentState : State;

  pickAction(): Action;

}