// Global Variables

// Initialize Cube to Goal_state and assign to goal State
// Makes for easier processing
var cube = [0, 1, 2,  3, 4, 5,  6, 7, 8,     9, 10, 11,  12, 13, 14,  15, 16, 17,    18, 19, 20,  21, 22, 23,  24, 25, 26];
const GOAL_CUBE = cube

// Face: 0...5: 0 -> White(Front), 1 -> Blue(Left), 2 -> Red(Top), 3 -> Green(Right), 4 -> Orange(Bottom), 5 -> Yellow(Back)
const FACE_POSITIONS = {'white': 0, 'blue': 1, 'red': 2, 'green': 3, 'orange': 4, 'yellow': 5}

// Displays the Cube in the canvas
//
// Uses the Global Cube Object
function visualize_cube() {
    console.log(cube)
}

// Description: This cube uses the this context for the button, event for the evt (These are the references incase they are needed in the future)
// Face, Rotation_direction are based on the specific button pressed to alter the cube
//
// this_button: Provides a reference to the button
// evt: Event object -> used if requiring event-based programming later in the project
// Face: 0...5: 0 -> White(Front), 1 -> Blue(Left), 2 -> Red(Top), 3 -> Green(Right), 4 -> Orange(Bottom), 5 -> Yellow(Back)
// rotation_direction: -1, 1: Represents the direction of rotation if facing the given face
//
// Note: Automatically visualizes cube after rotation
//
// Uses the Global Cube Object
function rotate_cube(this_button, evt, face, rotation_direction) {


    visualize_cube()
}

// Shuffles the cube using random face, and rotation_direction to ensure the it is a solvable cube
//
// Uses the Global Cube Object
function shuffle_cube() {

}
