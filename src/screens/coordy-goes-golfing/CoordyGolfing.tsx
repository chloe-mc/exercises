import React, { useState } from "react";
import ReactMapGL, { Source, Layer, Marker } from "react-map-gl";
import golfCourse from "./golf-course.json";
import holes from "./holes.json";
import coordyWithHat from "../../assets/coordy-golf-hat.png";
import {
  generateContours,
  generateWalkingPath,
  goGolfing,
  generateHoles,
} from "./geospatial-services";
import "./CoordyGolfing.scss";

const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number;
  width: number | string;
  height: number | string;
};

const CoordyGolfing = () => {
  const [coordy, setCoordy] = useState<any>(holes.features[0]);
  const [walkingPath, setWalkingPath] = useState<any>();
  const [contours, setContours] = useState<any>();
  const [newHoles, setNewHoles] = useState<any>();
  const [viewport, setViewport] = useState<Viewport>({
    width: "100%",
    height: "100vh",
    latitude: 30.948978863202708,
    longitude: -95.24198055267337,
    zoom: 14,
  });

  return (
    <div>
      <ReactMapGL
        mapboxApiAccessToken={token}
        {...viewport}
        onViewportChange={(newViewport: Viewport) => setViewport(newViewport)}
      >
        <button
          className="coordy-control__button"
          onClick={() => {
            walkingPath
              ? setWalkingPath(null)
              : setWalkingPath(generateWalkingPath(holes as any));
          }}
        >
          Show Walking Path
        </button>
        {walkingPath && (
          <button
            className="coordy-control__button"
            onClick={() => goGolfing(walkingPath, setCoordy)}
          >
            Go Golfing!
          </button>
        )}
        <button
          className="coordy-control__button"
          onClick={() =>
            contours
              ? setContours(null)
              : setContours(generateContours(golfCourse as any))
          }
        >
          Toggle Contours!
        </button>
        <button
          className="coordy-control__button"
          onClick={() =>
            newHoles
              ? setNewHoles(null)
              : setNewHoles(generateHoles(golfCourse as any))
          }
        >
          Toggle New Golf Course!
        </button>
        <Source id="golf-course" type="geojson" data={golfCourse as any}>
          <Layer
            id="golf-course-style"
            type="fill"
            paint={{
              "fill-color": "green",
              "fill-opacity": 0.2,
            }}
          />
        </Source>
        <Source id="holes" type="geojson" data={holes as any}>
          <Layer
            id="holes-style"
            type="circle"
            paint={{ "circle-color": "black" }}
          />
        </Source>
        <Marker
          latitude={coordy.geometry.coordinates[1]}
          longitude={coordy.geometry.coordinates[0]}
          offsetLeft={-17}
          offsetTop={-20}
        >
          <img
            className="coordy"
            alt="Coordy wearing an overly-real-looking golf hat"
            src={coordyWithHat}
          />
        </Marker>
        {walkingPath && (
          <Source id="walking-path" type="geojson" data={walkingPath}>
            <Layer
              id="walking-path-style"
              type="line"
              paint={{ "line-color": "gray" }}
            />
          </Source>
        )}
        {contours && (
          <Source id="contours" type="geojson" data={contours}>
            <Layer
              id="contours-style"
              type="line"
              paint={{ "line-color": "gray" }}
            />
          </Source>
        )}
        {newHoles && (
          <Source id="newHoles" type="geojson" data={newHoles}>
            <Layer
              id="newHoles-style"
              type="circle"
              paint={{
                "circle-color": "yellow",
                "circle-opacity": 0.4,
                "circle-radius": 10,
              }}
            />
          </Source>
        )}
      </ReactMapGL>
    </div>
  );
};

export { CoordyGolfing };
