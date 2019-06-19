# mdp-sandbox
Playing around with Markov Decision Processes and Reinforcement Learning


## robot-maze
This project is inspired by Prof. Abbeel's lecture on Markov Decision Processes and the robot maze example used to introduce MDPs and reinforcement learning. In the examples given, a robot has to navigate a 2D maze. 

The maze is constructed in such a way, that each tile represents a state with the available actions of turning up, right, down, or left. Exceptions are exit states, where the only action is to exit and get a reward. 

The transistion model defines a certain probability of the action actually resulting in the intended next state. In the examples, going up has a 10% chance of going left, an 80% chance of going up and a 10% chance of going right. 

Certain states cannot be entered. An attempt to navigate to them just leaves the robot at the prior state. In the examples, there are 2 exit states, one carrying a reward of 10, the other of -10. Actions can be setup in such a way, that staying alive (i.e. any action not being an exit action) returns a slightly negative reward to induce more risky behavior. 

The goal of this project is to get a deeper understanding of the basic structure of MDPs and how reinforcement learnings works in very simple environments. 