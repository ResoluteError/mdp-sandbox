import { Action } from './Action.model';

export class State {

  x : number;
  y : number;
  index : number;
  availableActions : Action[];
  isValid : boolean;

}
