import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MazeComponent } from './maze/maze.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faArrowRight, faArrowDown, faArrowLeft, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { ActionBarComponent } from './maze/action-bar/action-bar.component';
import { RobotComponent } from './maze/robot/robot.component';
import { FormsModule } from '@angular/forms';
import { SolverComponent } from './maze/solver/solver.component';

@NgModule({
  declarations: [
    AppComponent,
    MazeComponent,
    ActionBarComponent,
    RobotComponent,
    SolverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor() {
    library.add(faArrowRight,faArrowUp, faArrowDown, faArrowLeft, faDoorOpen);
  }

}
