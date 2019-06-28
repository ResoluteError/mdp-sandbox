import { Component, OnInit, Input } from '@angular/core';
import { MazeComponent } from '../maze.component';
import { Robot } from './robot.controller';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent extends Robot implements OnInit {

  @Input() maze : MazeComponent;

  stateIndex : number = 0;

  constructor() {
    super();
  }

  ngOnInit() {
  }


}
