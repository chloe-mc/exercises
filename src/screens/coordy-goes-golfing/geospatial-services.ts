import * as turf from "@turf/turf";
import { Feature } from "@turf/turf";

export const generateWalkingPath = (
  holes: turf.FeatureCollection
): turf.Feature<turf.LineString> => {
  const coordinates = turf.coordAll(holes);
  return turf.lineString(coordinates);
};

export const goGolfing = (
  walkingPath: turf.Feature<turf.LineString>,
  updatePosition: (newPosition: any) => void
) => {
  const animationRoute = generateAnimationRoute(walkingPath, 300);
  const pathCoordiantes = animationRoute.geometry?.coordinates;
  let counter = 0;
  const animate = () => {
    if (counter === pathCoordiantes?.length) return;
    const nextPoint = pathCoordiantes && turf.point(pathCoordiantes[counter]);
    updatePosition(nextPoint);
    requestAnimationFrame(animate);
    counter += 1;
  };

  animate();
};

const generateAnimationRoute = (
  line: turf.Feature<turf.LineString>,
  steps: number
): turf.Feature<turf.LineString> => {
  const lineDistance = turf.lineDistance(line, {
    units: "meters",
  });
  const animationRouteInterval = lineDistance / steps;

  let distance = 0;
  const animationRoute = Array.apply(null, Array(300)).map(() => {
    const routePoint = turf.along(line, distance, { units: "meters" });
    distance += animationRouteInterval;
    return turf.getCoord(routePoint) as turf.helpers.Position;
  });

  return {
    type: "Feature",
    properties: {},
    geometry: { coordinates: animationRoute, type: "LineString" },
  };
};

export const generateContours = (
  golfCourse: turf.Polygon
): turf.FeatureCollection => {
  const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const boundingBox = turf.bbox(golfCourse);
  const pointGrid = turf.pointGrid(boundingBox, 200, {
    units: "meters",
  });
  turf.featureEach(pointGrid, (feature: Feature<turf.Point>) => {
    feature.properties = {};
    feature.properties.elevation = Math.random() * 10;
  });
  return turf.isolines(pointGrid, breaks, { zProperty: "elevation" });
};

const getRandomPointsWithinPolygon = (
  points: turf.FeatureCollection,
  pointsNeeded: number,
  boundingBox: turf.BBox,
  polygon: turf.Polygon,
  totalPointsNeeded: number
): turf.FeatureCollection => {
  if (points.features.length === totalPointsNeeded) return points;

  const randomHoles = turf.randomPoint(pointsNeeded, { bbox: boundingBox });
  const holesToKeep = turf.pointsWithinPolygon(randomHoles, polygon);
  points.features = points.features.concat(holesToKeep.features).slice(0, 19);
  pointsNeeded = totalPointsNeeded - points.features.length;

  return getRandomPointsWithinPolygon(
    points,
    pointsNeeded,
    boundingBox,
    polygon,
    totalPointsNeeded
  );
};

export const generateHoles = (golfCourse: turf.Polygon) => {
  const boundingBox = turf.bbox(golfCourse);
  const initialHoles = {
    type: "FeatureCollection",
    features: [],
  };
  const holesNeeded = 18;
  return getRandomPointsWithinPolygon(
    initialHoles,
    holesNeeded,
    boundingBox,
    golfCourse,
    holesNeeded
  );
};
