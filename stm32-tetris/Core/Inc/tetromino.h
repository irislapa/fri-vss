#ifndef TETROMINO_H
#define TETROMINO_H

#include "lcd_ili9341.h"
#include "ugui.h"
// Size of a tetromino
#define TETROMINO_SIZE 16
#define TETROMINO_COUNT 7

// Tetromino struct definition
typedef struct {
	int rotation;
    char shape;
    uint16_t grid[TETROMINO_SIZE]; // linearized representation
    int x;
    int y;
} Tetromino;

// Functions to manipulate and get data about tetrominos
Tetromino generateTetromino(int s, int r, int p);
int rotateTetromino(int x, int y, int r);
#endif // TETROMINO_H
