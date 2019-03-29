
////////////////////////////////////////////////////////////
//                                                        //
// **********************CLASSES**************************//
//                                                        //
////////////////////////////////////////////////////////////

// Suport Class
// Used for mapping values of rotations
class bidirectionalMap{
    constructor(forward_map){
        this.map = forward_map;
        this.reverseMap = {};
        for(var key in forward_map){
            var map_value = forward_map[key];
            this.reverseMap[map_value] = key;
        }
    }
}
bidirectionalMap.prototype.getValue = function(key){return this.map[key]; };
bidirectionalMap.prototype.getReverseValue = function(key){ return this.reverseMap[key]; };

// Used for mapping block position to colors on faces
class single_cube {
    constructor(starting_position, starting_color_positions, colors){
        this.starting_position = starting_position;
        this.block_colors = color;
        this.block_positions = starting_color_positions;
    }
    get_color(bimap_object, current_position){

    }
    shift_cube(bimap_object, direction){
        var current_positions = this.block_positions;
        for(var i in current_positions){
            if(direction == 1){
                current_positions[i] = bimap_object.getValue(current_positions[i]);
            }
            else {
                current_positions[i] = bimap_object.getReverseValue(current_positions[i]);
            }
        }
        return current_positions;
    }
}

////////////////////////////////////////////////////////////
//                                                        //
// *********************VARIABLES*************************//
//                                                        //
////////////////////////////////////////////////////////////



// Face: 0...5: 0 -> White(Front), 1 -> Blue(Left), 2 -> Red(Top), 3 -> Green(Right), 4 -> Orange(Bottom), 5 -> Yellow(Back)
const FACE_POSITIONS = new bidirectionalMap({'white': 0, 'blue': 1, 'red': 2, 'green': 3, 'orange': 4, 'yellow': 5});

// Maps for Rotations

var rotations = {};

// Position White, 0(Front)
const FRONT_ROTATION = new bidirectionalMap({6:8, 8:26, 26:24, 24:6,   7:17, 17:25, 25:15, 15:7});
rotations[FACE_POSITIONS.getReverseValue(0)] = FRONT_ROTATION;

// Position Blue, 1(Left)
const LEFT_ROTATION = new bidirectionalMap({0:6, 6:24, 24:18, 18:0,   3:15, 15:21, 21:9, 9:3});
rotations[FACE_POSITIONS.getReverseValue(1)] = LEFT_ROTATION;

// Position Red, 2(Top)
const TOP_ROTATION = new bidirectionalMap({0:2, 2:8, 8:6, 6:0,   1:5, 5:7, 7:3, 3:1});
rotations[FACE_POSITIONS.getReverseValue(2)] = TOP_ROTATION;

// Position Green, 3(Right)
const RIGHT_ROTATION = new bidirectionalMap({8:2, 2:20, 20:26, 26:8,   5:11, 11:23, 23:17, 17:5});
rotations[FACE_POSITIONS.getReverseValue(3)] = RIGHT_ROTATION;

// Position Orange, 4(Bottom)
const BOTTOM_ROTATION = new bidirectionalMap({18:24, 24:26, 26:20, 20:18,   19:21, 21:25, 25:23, 23:19});
rotations[FACE_POSITIONS.getReverseValue(4)] = BOTTOM_ROTATION;

// Position Yellow, 5(Back)
const BACK_ROTATION = new bidirectionalMap({2:0, 0:18, 18:20, 20:2,   1:9, 9:19, 19:11, 11:1});
rotations[FACE_POSITIONS.getReverseValue(5)] = BACK_ROTATION;

const FACE_ASSOCIATIONS = {};

// Face 0 to 5 related faces
FACE_ASSOCIATIONS[0] = new bidirectionalMap({0:0, 1:2, 2:3, 3:4, 4:1});
FACE_ASSOCIATIONS[1] = new bidirectionalMap({1:1, 5:2, 2:0, 0:4, 4:5});
FACE_ASSOCIATIONS[2] = new bidirectionalMap({2:2, 5:3, 3:0, 0:1, 1:5});
FACE_ASSOCIATIONS[3] = new bidirectionalMap({3:3, 5:4, 4:0, 0:2, 2:5});
FACE_ASSOCIATIONS[4] = new bidirectionalMap({4:4, 0:3, 3:5, 5:1, 1:0});
FACE_ASSOCIATIONS[5] = new bidirectionalMap({5:5, 2:1, 1:4, 4:3, 3:2});

// Maps for Colors

// Associates block # with 
var colors = {};

// Initialize Cube to Goal_state and assign to goal State
// Makes for easier processing
var cube = [0, 1, 2,  3, 4, 5,  6, 7, 8,     9, 10, 11,  12, 13, 14,  15, 16, 17,    18, 19, 20,  21, 22, 23,  24, 25, 26];
var corner_cubes = [0, 2, 8, 6, 18, 20, 26, 24];
var middle_cubes = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
var core_cubes = [4, 10, 12, 14, 16, 22];


var cubes = {};

// Initialize the corner cubes
var current_cube = new single_cube(0, [2, 1, 5], [FACE_POSITIONS.getReverseValue(2),FACE_POSITIONS.getReverseValue(1),FACE_POSITIONS.getReverseValue(5)]);
for(i in corner_cubes){
    if(i < 9){
        current_cube.starting_position = i;
        cubes[i] = current_cube;
        current_cube.block_positions = current_cube.shift_cube(FACE_ASSOCIATIONS[2]);
        for(var j in current_cube.block_positions, 1){
            current_cube.block_colors[j] = FACE_POSITIONS.getReverseValue(j);
        }
    }
    else{
        if(i == 18){
            current_cube = new single_cube(i,[4,1,5], [FACE_POSITIONS.getReverseValue(4),FACE_POSITIONS.getReverseValue(1),FACE_POSITIONS.getReverseValue(5)]);
        }
        current_cube.starting_position = i;
        cubes[i] = current_cube;
        current_cube.block_positions = current_cube.shift_cube(FACE_ASSOCIATIONS[2]);
        for(var j in current_cube.block_positions, -1){
            current_cube.block_colors[j] = FACE_POSITIONS.getReverseValue(j);
        }
    }
}

// Initialize the middle cubes
var current_cube = new single_cube(0, [2, 1], [FACE_POSITIONS.getReverseValue(2),FACE_POSITIONS.getReverseValue(5)]);
for(i in middle_cubes){
    if(i < 9){
        current_cube.starting_position = i;
        cubes[i] = current_cube;
        current_cube.block_positions = current_cube.shift_cube(FACE_ASSOCIATIONS[2]);
        for(var j in current_cube.block_positions, 1){
            current_cube.block_colors[j] = FACE_POSITIONS.getReverseValue(j);
        }
    }
    else{
        if(i == 18){
            current_cube = new single_cube(i,[4,1,5], [FACE_POSITIONS.getReverseValue(4),FACE_POSITIONS.getReverseValue(1),FACE_POSITIONS.getReverseValue(5)]);
        }
        current_cube.starting_position = i;
        cubes[i] = current_cube;
        current_cube.block_positions = current_cube.shift_cube(FACE_ASSOCIATIONS[2]);
        for(var j in current_cube.block_positions, -1){
            current_cube.block_colors[j] = FACE_POSITIONS.getReverseValue(j);
        }
    }
}

// Initialize the center cubes
var current_cube = new single_cube(4, [2], [FACE_POSITIONS.getReverseValue(2)]);
for(i in core_cubes){
    var current_position;
    if(i == 4){
        current_position = 2;
    }
    else if(i == 10){
        current_position = 5;
    }
    else if(i == 12){
        current_position = 1;
    }
    else if(i == 14){
        current_position = 3;
    }
    else if(i == 16){
        current_position = 0;
    }
    else if(i == 22){
        current_position = 4;
    }
    current_cube.starting_position = i;
    current_cube.block_positions = [current_position];
    current_cube.block_colors = [FACE_POSITIONS.getReverseValue(current_position)];
    cubes[i] = current_cube;
}

const GOAL_CUBE = cube


////////////////////////////////////////////////////////////
//                                                        //
// **********************FUNCTIONS************************//
//                                                        //
////////////////////////////////////////////////////////////

// Displays the Cube in the canvas
//
// Uses the Global Cube Object
function visualize_cube() {
    var canvas = document.getElementById("CubeDisplay");
    var canvas_context = canvas.getContext("2d");

    canvas_context.fillRect(10,20, 40, 40);

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
function rotate_cube(this_button, evt, face_color, rotation_direction) {


    visualize_cube()
}

// Shuffles the cube using random face, and rotation_direction to ensure the it is a solvable cube
//
// Uses the Global Cube Object
function shuffle_cube() {

}

// Solves the cube using the A* algorithm
//
// Uses the Global Cube Object
function solve_cube(){

}
