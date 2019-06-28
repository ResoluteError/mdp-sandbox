import { Component, OnInit, Input } from '@angular/core';
import { Solver } from './solver.controller';
import { MazeComponent } from '../maze.component';
import { ActionType } from 'src/models/Action.model';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss']
})
export class SolverComponent extends Solver implements OnInit {

  @Input() maze : MazeComponent;

  kVal : number = 1;
  status: string = "Waiting";

  constructor() {
    super(0.9);
   }

  ngOnInit() {
  }

  doValueIteration(){

    this.status = "Calculating";
    this.optimalStrategy = {};
    this.memo = {};
    var result = [];
    for(var i = 0; i < this.maze.states.length; i++){
      result.push(this.valueIteration(i, this.kVal));

    }
    this.maze.draw();
    this.maze.drawValues(result);

    var stratArray : ActionType[] = [];
    for(var i = 0; i < this.maze.states.length; i++){
      if(typeof this.optimalStrategy[i] === "undefined"){
        stratArray.push(ActionType.Exit)
      } else {
        stratArray.push(this.optimalStrategy[i]);
      }
    }
    this.maze.drawActions(stratArray);

    this.status = "Finished";

  }

  doPolicyIteration(){
    console.log("Not Implemented!")
  }

}
