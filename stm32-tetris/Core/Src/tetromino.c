

#include "tetromino.h"

// Predefined tetromino shapes
int tetrominoShapes[TETROMINO_COUNT][TETROMINO_SIZE] = {
    {
    0, 0, 0, 0,
    1, 1, 1, 1,
    0, 0, 0, 0,
    0, 0, 0, 0
    },
    {
    0, 1, 0, 0,
    1, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
    },
    {
    1, 1, 0, 0,
    1, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
    },
    {
    1, 0, 0, 0,
    1, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
    },
    {
    0, 0, 1, 0,
    1, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
    },
    {
    0, 1, 1, 0,
    1, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
    },
    {
    1, 1, 0, 0,
    0, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
    }   
};

int rotateTetromino(int x, int y, int r) {
    switch (r % 4) {
        case 0: return (y * 4) + x; //0
        case 1: return 12 + y - (x * 4); //90
        case 2: return 15 - (y * 4) - x; //180
        case 3: return 3 - y + (x * 4); //270
    }
    return 0;
}


Tetromino generateTetromino(int s, int r, int p) {
    Tetromino tetromino;
    uint16_t c;
    switch (s) {
            case 0:
            	c = C_CYAN;
            	tetromino.shape = 'I';
            break;
            case 1:
            	c = C_PURPLE;
            	tetromino.shape = 'T';
            break;
            case 2:
            	c = C_YELLOW;
            	tetromino.shape = 'O';
            	break;
            case 3:
            	c = C_BLUE;
            	tetromino.shape = 'J';
            	break;
            case 4:
            	c = C_ORANGE;
            	tetromino.shape = 'L';
            	break;
            case 5:
            	c = C_GREEN;
            	tetromino.shape = 'S';
            	break;
            case 6:
            	c = C_RED;
            	tetromino.shape = 'Z';
            	break;
        }

    for (int i = 0; i < 16; i++) {
    	if (tetrominoShapes[s][i] == 1) {
    		tetromino.grid[i] = c;
    	}
    	else tetromino.grid[i] = 0;
    }

    tetromino.x = p;
    tetromino.y = 0;
    tetromino.rotation = r;
    return tetromino;
}


