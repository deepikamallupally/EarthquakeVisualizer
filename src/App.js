import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon for React-Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

// Region centers and zoom levels for some countries and continents
const regions = [
  { name: "World", center: [20, 0], zoom: 2 },
  { name: "North America", center: [54, -105], zoom: 3 },
  { name: "South America", center: [-15, -60], zoom: 3 },
  { name: "Europe", center: [54, 15], zoom: 4 },
  { name: "Asia", center: [40, 100], zoom: 3 },
  { name: "Africa", center: [0, 20], zoom: 3 },
  { name: "Australia", center: [-25, 135], zoom: 4 },
  { name: "India", center: [20, 77], zoom: 5 },
  { name: "Japan", center: [36, 138], zoom: 5 },
  { name: "California, USA", center: [36.7783, -119.4179], zoom: 6 },
];

// Component for changing map view on region selection
function MapViewChanger({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minMagnitude, setMinMagnitude] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]); // World by default

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch earthquake data!");
        }
        const data = await response.json();
        setEarthquakes(data.features);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter earthquakes by minimum magnitude
  const filteredQuakes = earthquakes.filter(
    (q) => q.properties.mag >= minMagnitude
  );

  // Helper for map marker color
  function getColor(mag) {
    if (mag >= 6) return "red";
    if (mag >= 5) return "orange";
    if (mag >= 4) return "yellow";
    return "blue";
  }

  // Custom marker icon for map
  function createMarkerIcon(mag) {
    const color = getColor(mag);
    return L.divIcon({
      html: `<div style="
        background:${color};
        width:${8 + mag * 3}px;
        height:${8 + mag * 3}px;
        border-radius:50%;
        border:2px solid #fff;
        opacity:0.85;
      "></div>`,
      className: "",
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        padding: "1rem",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textShadow: "0 0 5px rgba(0,0,0,0.7)",
      }}
    >
      <h2 style={{ textAlign: "center", marginTop: "1rem" }}>
        Earthquake Visualizer
      </h2>

      {loading && <p>Loading earthquake data...</p>}
      {error && <p style={{ color: "yellow" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* Region selection dropdown */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="region-select">
              Select Region:{" "}
              <select
                id="region-select"
                value={selectedRegion.name}
                onChange={(e) =>
                  setSelectedRegion(
                    regions.find((r) => r.name === e.target.value) || regions[0]
                  )
                }
                style={{
                  padding: "0.4rem",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {regions.map((region) => (
                  <option key={region.name} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Magnitude slider */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Minimum Magnitude: {minMagnitude}
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={minMagnitude}
                onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </label>
          </div>

          <MapContainer
            center={selectedRegion.center}
            zoom={selectedRegion.zoom}
            style={{
              height: "60vh",
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(0,0,0,0.5)",
            }}
          >
            <MapViewChanger
              center={selectedRegion.center}
              zoom={selectedRegion.zoom}
            />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredQuakes.map((quake) => {
              const [lon, lat, depth] = quake.geometry.coordinates;
              const mag = quake.properties.mag;
              return (
                <Marker
                  key={quake.id}
                  position={[lat, lon]}
                  icon={createMarkerIcon(mag)}
                >
                  <Popup style={{ color: "#000" }}>
                    <b>Magnitude:</b> {mag}
                    <br />
                    <b>Location:</b> {quake.properties.place}
                    <br />
                    <b>Depth:</b> {depth} km
                    <br />
                    <b>Time:</b>{" "}
                    {new Date(quake.properties.time).toLocaleString()}
                    <br />
                    <a
                      href={quake.properties.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Details on USGS
                    </a>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </>
      )}
    </div>
  );
}
