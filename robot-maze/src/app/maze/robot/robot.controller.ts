import { Maze } from '../maze.controller';
import { PolicyFunction } from 'src/models/PoilcyFunction.model';
import { ValueFunction } from 'src/models/ValueFunction.model';
import { ActionType } from 'src/models/Action.model';
import { Position } from 'src/models/Robot.model';
import { MazeComponent } from '../maze.component';

export class Robot {

  maze: MazeComponent;
  policy : PolicyFunction;
  value : ValueFunction;
  
  constructor(){

  }

  assignPolicy( fn : PolicyFunction): Robot{
    this.policy = fn;
    return this;
  }

  assignValueFunction( fn : ValueFunction): Robot{
    this.value = fn;
    return this;
  }


}