const test = require("node:test");
const assert = require("assert").strict;
const { createPoint, agePoint, updateGrid, doTheThing } = require("./skyline");

test("createPoint returns obj with appropriate position on coords key", () => {
  const line = "position=< 21373,  53216> velocity=<-2, -5>";
  const point = createPoint(line);
  assert.deepEqual(point.coords, [21373, 53216]);
  const lineWithNegatives = "position=<-52902, -21015> velocity=< 5,  2>";
  const pointWithNegatives = createPoint(lineWithNegatives);
  assert.deepEqual(pointWithNegatives.coords, [-52902, -21015]);
});
test("createPoint returns with parsed velocity information", () => {
  const line = "position=< 21373,  53216> velocity=<-2, -5>";
  const point = createPoint(line);
  assert.deepEqual(point.velocity, [-2, -5]);
});
test("agePoint increases the x coord based on the x velocity", () => {
  const point = {
    coords: [0, 0],
    velocity: [1, 0],
  };
  assert.equal(agePoint(point).coords[0], 1);
});
test("agePoint increases the y coord based on the y velocity", () => {
  const point = {
    coords: [0, 0],
    velocity: [0, 1],
  };
  assert.equal(agePoint(point).coords[1], 1);
});

test("updateGrid: given a single point with no diff will update the correct space in the grid with a hash", () => {
  const point = {
    coords: [0, 0],
    velocity: [0, 1],
  };
  const grid = ["."];
  const updatedGrid = updateGrid(grid, point);
  assert.equal(updatedGrid[0][0], "#");
});
test("updateGrid: given a single point with a negative diff will not update the grid", () => {
  const point = {
    coords: [-1, -1],
    velocity: [0, 1],
  };
  const grid = ["."];
  const updatedGrid = updateGrid(grid, point);
  assert.equal(updatedGrid[0][0], ".");
});

test("does the thing", () => {
  doTheThing();
});
