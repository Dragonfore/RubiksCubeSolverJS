
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
        this.block_colors = colors;
        this.block_positions = starting_color_positions;
    }
    get_color(current_position){
        return this.block_colors[this.block_positions.indexOf(parseInt(current_position, 10))];
    }
    shift_cube(bimap_object, direction){
        var current_positions = this.block_positions.slice(0);
        for(var i in current_positions){
            if(direction > 0){
                current_positions[i] = bimap_object.getValue(this.block_positions[i]);
            }
            else if(direction < 0){
                current_positions[i] = parseInt(bimap_object.getReverseValue(this.block_positions[i]), 10);
            }
        }
        this.block_positions = current_positions;
        return current_positions;
    }
}

////////////////////////////////////////////////////////////
//                                                        //
// *********************VARIABLES*************************//
//                                                        //
////////////////////////////////////////////////////////////

// Constants for visualization assistance
const BLOCK_SIZE = 15;

// Face: 0...5: 0 -> White(Front), 1 -> Blue(Left), 2 -> Red(Top), 3 -> Green(Right), 4 -> Orange(Bottom), 5 -> Yellow(Back)
const FACE_POSITIONS = new bidirectionalMap({'white': 0, 'blue': 1, 'red': 2, 'green': 3, 'orange': 4, 'yellow': 5});

// Maps for Rotations
var rotations = {};

// Position White, 0(Front)
const FRONT_ROTATION = new bidirectionalMap({6:8, 8:26, 26:24, 24:6,   16:16,   7:17, 17:25, 25:15, 15:7});
rotations[FACE_POSITIONS.getReverseValue(0)] = FRONT_ROTATION;

// Position Blue, 1(Left)
const LEFT_ROTATION = new bidirectionalMap({0:6, 6:24, 24:18, 18:0,   12:12,  3:15, 15:21, 21:9, 9:3});
rotations[FACE_POSITIONS.getReverseValue(1)] = LEFT_ROTATION;

// Position Red, 2(Top)
const TOP_ROTATION = new bidirectionalMap({0:2, 2:8, 8:6, 6:0,   4:4,   1:5, 5:7, 7:3, 3:1});
rotations[FACE_POSITIONS.getReverseValue(2)] = TOP_ROTATION;

// Position Green, 3(Right)
const RIGHT_ROTATION = new bidirectionalMap({8:2, 2:20, 20:26, 26:8,   14:14,   5:11, 11:23, 23:17, 17:5});
rotations[FACE_POSITIONS.getReverseValue(3)] = RIGHT_ROTATION;

// Position Orange, 4(Bottom)
const BOTTOM_ROTATION = new bidirectionalMap({18:24, 24:26, 26:20, 20:18,   22:22,   19:21, 21:25, 25:23, 23:19});
rotations[FACE_POSITIONS.getReverseValue(4)] = BOTTOM_ROTATION;

// Position Yellow, 5(Back)
const BACK_ROTATION = new bidirectionalMap({2:0, 0:18, 18:20, 20:2,   10:10,   1:9, 9:19, 19:11, 11:1});
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
var corner_cubes = [0, 2, 6, 8, 18, 20, 26, 24];
var middle_cubes = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
var core_cubes = [4, 10, 12, 14, 16, 22];


var cubes = {};

// Initialize the corner cubes

for(var i of corner_cubes){
    var current_position = [];
    if(i == 0){
        current_position = [2, 1, 5];
    }
    else if(i == 2){
        current_position = [2, 3, 5];
    }
    else if(i == 6){
        current_position = [2, 1, 0];
    }
    else if(i == 8){
        current_position = [2, 3, 0];
    }
    else if(i == 18){
        current_position = [4, 1, 5];
    }
    else if(i == 20){
        current_position = [4, 5, 3];
    }
    if(i == 24){
        current_position = [4, 1, 0];
    }
    else if(i == 26){
        current_position = [4, 0, 3];
    }
    cubes[i] = new single_cube(i, current_position, [FACE_POSITIONS.getReverseValue(current_position[0]), FACE_POSITIONS.getReverseValue(current_position[1]), FACE_POSITIONS.getReverseValue(current_position[2])]);
}

// Initialize the middle cubes
for(var i of middle_cubes){
    var current_position = [];
    if(i == 1){
        current_position = [2, 5];
    }
    else if(i == 3){
        current_position = [2, 1];
    }
    else if(i == 5){
        current_position = [2, 3];
    }
    else if(i == 7){
        current_position = [2, 0];
    }
    else if(i == 9){
        current_position = [1, 5];
    }
    else if(i == 11){
        current_position = [5, 3];
    }
    if(i == 15){
        current_position = [0, 1];
    }
    else if(i == 17){
        current_position = [0, 3];
    }
    else if(i == 19){
        current_position = [4, 5];
    }
    else if(i == 21){
        current_position = [4, 1];
    }
    else if(i == 23){
        current_position = [4, 3];
    }
    else if(i == 25){
        current_position = [4, 0];
    }
    cubes[i] = new single_cube(i, current_position, [FACE_POSITIONS.getReverseValue(current_position[0]), FACE_POSITIONS.getReverseValue(current_position[1])]);
}

// Initialize the center cubes
for(var i of core_cubes){
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
    cubes[i] = new single_cube(i, [current_position], [FACE_POSITIONS.getReverseValue(current_position)]);
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
    var current_position_x, current_position_y;
    var DELTA_X, DELTA_Y;
    for(var i of Object.keys(FACE_POSITIONS.map)){
        
        current_position_x = 0;
        current_position_y = 0;
        current_side = FACE_POSITIONS.getValue(i);

        // FRONT SIDE
        if(current_side == 0){
            DELTA_X = 3 * BLOCK_SIZE;
            DELTA_Y = 3 * BLOCK_SIZE;
        }
        // LEFT SIDE
        else if(current_side == 1){
            DELTA_X = 0;
            DELTA_Y = 3 * BLOCK_SIZE;
        }
        // TOP SIDE
        else if(current_side == 2){
            DELTA_X = 3 * BLOCK_SIZE;
            DELTA_Y = 0;
        }
        // RIGHT SIDE
        else if(current_side == 3){
            DELTA_X = 6 * BLOCK_SIZE;
            DELTA_Y = 3 * BLOCK_SIZE;
        }
        // BOTTOM SIDE
        else if(current_side == 4){
            DELTA_X = 3 * BLOCK_SIZE;
            DELTA_Y = 6 * BLOCK_SIZE;
        }
        // BACK SIDE
        else if(current_side == 5){
            DELTA_X = 9 * BLOCK_SIZE;
            DELTA_Y = 0;
        }
        

        for(var j of Object.keys(rotations[i].map)){
            canvas_context.fillStyle = cubes[cube[j]].get_color(current_side);
            // Draw the rectangles of the given color
            canvas_context.fillRect(current_position_x % (3 * BLOCK_SIZE) + DELTA_X + 0.5,
                            Math.floor(current_position_y) * BLOCK_SIZE + DELTA_Y + 0.5, BLOCK_SIZE, BLOCK_SIZE);
            canvas_context.stroke();
            canvas_context.fillStyle = "black";
            // Draw the outline
            canvas_context.strokeRect(current_position_x % (3 * BLOCK_SIZE) + DELTA_X + 0.5,
                            Math.floor(current_position_y) * BLOCK_SIZE + DELTA_Y + 0.5, BLOCK_SIZE, BLOCK_SIZE);
            canvas_context.fillStyle = cubes[j].get_color(current_side);
            current_position_x += BLOCK_SIZE;
            current_position_y += 1.001/3.0;
        }
    }

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
function rotate_cube(this_button, evt, face_color, rotation_direction){
    rotate_cube_no_encapsulation(face_color, rotation_direction);
}
function rotate_cube_no_encapsulation(face_color, rotation_direction) {

    var face_number = FACE_POSITIONS.getValue(face_color);

    // Shifts face colors
    for(var i of Object.keys(rotations[face_color].map)){
        if([4, 10, 12, 14, 16, 22].includes(parseInt(i, 10))){
            continue;
        }
        cubes[cube[i]].shift_cube(FACE_ASSOCIATIONS[face_number], rotation_direction);
    }
    
    // Shifts cube positions
    var blocks_affected = Object.keys(rotations[face_color].map);
    var temp_cube_assortment = cube.slice(0);
    for(var i of blocks_affected){
        if(rotation_direction > 0){
            temp_cube_assortment[rotations[face_color].getValue(i)] = cube[i];
        }
        else if(rotation_direction < 0){
            temp_cube_assortment[rotations[face_color].getReverseValue(i)] = cube[i];
        }
    }
    cube = temp_cube_assortment;

    visualize_cube();
}

// Shuffles the cube using random face, and rotation_direction to ensure the it is a solvable cube
//
// Uses the Global Cube Object
function shuffle_cube() {
    var face_to_be_shifted = randomInt();
    console.log(face_to_be_shifted);
    var rotation_direction = find_if_number_is_positive_or_negative(face_to_be_shifted);
    rotate_cube_no_encapsulation(FACE_POSITIONS.getReverseValue(Math.abs(face_to_be_shifted) - 1), rotation_direction);
    visualize_cube();
}


function shuffle_n_times(n){
    var current_iterations = 0;
    var interval_ID = setInterval(function(){
        shuffle_cube();

        if(++current_iterations >= n){
            window.clearInterval(interval_ID);
        }
    }, 100);
}

// Assistance function to generate a random rotation
// of a cube, which results in | 1 -> 6 |
function randomInt(){
    var floating_random = Math.random() * 12 - 6;
    var floored_random = Math.floor(floating_random);
    if(floored_random >= 0){
        floored_random += 1;
    }
    return floored_random;
}

function find_if_number_is_positive_or_negative(number){
    if(number > 0){
        return 1;
    }
    else if(number == 0){
        return 0;
    }
    else{
        return -1;
    }
}

// Solves the cube using the A* algorithm
//
// Uses the Global Cube Object
function solve_cube(){
    visualize_cube();
}

// Scores the current cube position
function score_cube(cube_assortment){

}
