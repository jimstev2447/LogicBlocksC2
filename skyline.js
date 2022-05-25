const { readFileSync } = require("fs");

function getPositionCoords(str) {
  const [_, coords] = /position=<(.*)>\s/.exec(str);
  const [x, y] = coords.split(", ");
  return [+x, +y];
}
function getVelocityCoords(str) {
  const [_1, velocity] = /velocity=<(.*)>/.exec(str);
  const [vx, vy] = velocity.split(", ");
  return [+vx, +vy];
}

const createPoint = (str) => {
  const point = {};
  point.coords = getPositionCoords(str);
  point.velocity = getVelocityCoords(str);
  return point;
};

const agePoint = (point, age = 1) => {
  const newPoint = {
    coords: [...point.coords],
    velocity: [...point.velocity],
  };
  newPoint.coords[0] += newPoint.velocity[0] * age;
  newPoint.coords[1] += newPoint.velocity[1] * age;
  return newPoint;
};

const createGrid = (width, height) => {
  const grid = [];
  for (let h = 0; h <= height; h++) {
    grid.push(".".repeat(width));
  }
  return grid;
};

const updateGrid = (
  grid,
  point,
  biggestX = 0,
  biggestY = 0,
  xAdjust = 0,
  yAdjust = 0
) => {
  const gridCopy = [...grid];
  const y = point.coords[1];
  const x = point.coords[0];
  if (x >= 0 && y >= 0) {
    const yPos = y - biggestY + yAdjust;
    const xPos = x - biggestX + xAdjust;
    gridCopy[yPos] =
      gridCopy[yPos].slice(0, xPos) + "#" + gridCopy[yPos].slice(xPos + 1);
  }
  return gridCopy;
};

function agePoints(points, age) {
  return points.map((p) => {
    const newPoint = agePoint(p, age);
    return newPoint;
  });
}
const findDiff = (points) => {
  const { biggestX, biggestY, smallestX, smallestY } = points.reduce(
    (acc, p) => {
      const x = p.coords[0];
      const y = p.coords[1];
      if (x > acc.biggestX) acc.biggestX = x;
      if (y > acc.biggestY) acc.biggestY = y;
      if (y < acc.smallestY) acc.smallestY = y;
      if (x < acc.smallestX) acc.smallestX = x;
      return acc;
    },
    { biggestX: 0, biggestY: 0, smallestX: Infinity, smallestY: Infinity }
  );

  return {
    xDiff: biggestX - smallestX,
    yDiff: biggestY - smallestY,
    smallestX,
    smallestY,
    biggestX,
    biggestY,
  };
};
function findPointOfConvergance(positions) {
  let bestGuess = 0;
  let prevDiff = findDiff(positions);
  let shouldContinue = true;
  while (shouldContinue) {
    bestGuess++;
    const agedPoints = agePoints(positions, bestGuess);
    const newDiff = findDiff(agedPoints);
    if (newDiff.xDiff < prevDiff.xDiff || newDiff.yDiff < prevDiff.yDiff) {
      prevDiff = newDiff;
      shouldContinue = true;
    } else {
      bestGuess--;
      shouldContinue = false;
    }
  }
  return bestGuess;
}
function drawPointsOnGrid(
  grid,
  positions,
  biggestX,
  biggestY,
  xAdjust,
  yAdjust
) {
  return positions.reduce((grid, point) => {
    return updateGrid(grid, point, biggestX, biggestY, xAdjust, yAdjust);
  }, grid);
}
function doTheThing() {
  const data = readFileSync("./data.txt", "utf-8");

  //Data Parsing
  const positionStrings = data.split("\n");
  const positions = positionStrings.map(createPoint);

  const POC = findPointOfConvergance(positions);

  const agedPoints = agePoints(positions, POC);

  const { biggestX, biggestY, xDiff, yDiff } = findDiff(agedPoints);
  const updatedGrid = drawPointsOnGrid(
    createGrid(xDiff, yDiff),
    agedPoints,
    biggestX,
    biggestY,
    xDiff,
    yDiff
  );

  console.log(updatedGrid.join("\n"));
}

module.exports = {
  createPoint,
  createGrid,
  agePoint,
  agePoints,
  updateGrid,
  doTheThing,
};
