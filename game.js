const mazeHeight = 400;
const mazeWidth = 400;
let playerX = Math.floor(Math.random() * mazeWidth);
let playerY = Math.floor(Math.random() * mazeHeight);
const ctx = canvas.getContext('2d');

async function getData() {
  const response = await fetch('The Infinity Maze 07.json');
  const data = await response.json();
  return data;
}

async function generateMaze() {
  const data = await getData();
  const cells = data.cells;
  const cellBit = data.cell_bit;

  // Initialize the maze with all walls
  const maze = [];
  for (let y = 0; y < mazeHeight; y++) {
    maze.push([]);
    for (let x = 0; x < mazeWidth; x++) {
      maze[y].push('#');
    }
  }

  // Set the starting and exit positions
  let startX = 0;
  let startY = 0;
  let exitX = 0;
  let exitY = 0;

  // Iterate through the cells to build the maze
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      const cell = cells[y][x];

      if (!(cell & cellBit.block)) {
        // This cell is not a wall, so add it to the maze
        maze[y][x] = ' ';
      }

      if (cell & cellBit.stair_up) {
        // This cell is the starting position
        startX = x;
        startY = y;
      }

      if (cell & cellBit.stair_down) {
        // This cell is the exit position
        exitX = x;
        exitY = y;
      }
    }
  }

  // Set the player's starting position
  playerX = startX;
  playerY = startY;

  return maze;
}

// Draw the maze and player on the canvas
function draw(maze) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grid
  ctx.strokeStyle = '#ccc';
  for (let i = 0; i <= mazeWidth; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 20, 0);
    ctx.lineTo(i * 20, mazeHeight * 20);
    ctx.stroke();
  }
  for (let i = 0; i <= mazeHeight; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 20);
    ctx.lineTo(mazeWidth * 20, i * 20);
    ctx.stroke();
  }

  // Draw the maze
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[y][x] === '#') {
        ctx.fillStyle = '#000';
        ctx.fillRect(x * 20, y * 20, 20, 20);
      }

      // Draw the room number
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px sans-serif';
      ctx.fillText(y * mazeWidth + x + 1, x * 20 + 10, y * 20 + 10);
    }
  }

  // Draw the player
  ctx.fillStyle = '#f00';
  ctx.fillRect(playerX * 20, playerY * 20, 20, 20);

  // Draw the exit
  ctx.fillStyle = '#0f0';
  ctx.fillRect(exitX * 20, exitY * 20, 20, 20);
}

// Handle player movement
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp') {
    if (maze[playerY - 1][playerX] !== '#') {
      playerY--;
    }
   } else if (event.key === 'ArrowDown') {
    if (maze[playerY + 1][playerX] !== '#') {
      playerY++;
    }
  } else if (event.key === 'ArrowLeft') {
    if (maze[playerY][playerX - 1] !== '#') {
      playerX--;
    }
  } else if (event.key === 'ArrowRight') {
    if (maze[playerY][playerX + 1] !== '#') {
      playerX++;
    }
  }

  draw(maze);
});

// Start the game
async function startGame() {
  const maze = await generateMaze();
  draw(maze);
}

startGame();
