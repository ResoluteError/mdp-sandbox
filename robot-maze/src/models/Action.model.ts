export class Action {

  type : ActionType;

  static AllNavigationActions() : Action[] {

    return [
      {
        type: ActionType.MoveUp
      },
      {
        type: ActionType.MoveRight
      },
      {
        type: ActionType.MoveDown
      },
      {
        type: ActionType.MoveLeft
      }
    ]

  }

  static GetExitAction(): Action[] {
    return [
      {
        type: ActionType.Exit
      }
    ]
  }


}

export interface ActionResult {

  reward: number;
  nextState: number;
  completed? : boolean;

}

export enum ActionType {

  MoveUp = "up",
  MoveRight = "right",
  MoveDown = "down",
  MoveLeft = "left",
  Exit = "exit"

}

