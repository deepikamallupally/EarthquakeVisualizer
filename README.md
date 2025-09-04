
# Earthquake Visualizer

## Overview

Earthquake Visualizer is an interactive React web application that fetches and displays recent earthquake data from the USGS in real-time on a world map. Users can filter earthquakes by magnitude and zoom to various global regions. The visual markers convey earthquake magnitude by size and color, and detailed information is available on click.

## Features

- Fetches live earthquake data from the [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).
- Interactive Leaflet map showing earthquake locations globally.
- Color-coded and size-scaled markers representing earthquake magnitudes:
  - Blue < 4.0
  - Yellow 4.0–4.9
  - Orange 5.0–5.9
  - Red ≥ 6.0
- Region selection dropdown to center and zoom map to continents and countries.
- Slider to filter earthquakes below a minimum magnitude threshold.
- Earthquake info popups with magnitude, location, depth, time, and USGS link.
- Responsive and visually appealing gradient background with contrasting UI.
- Uses React functional components and hooks for state and lifecycle management.

## Getting Started

### Prerequisites

- Node.js (v14 or newer recommended)
- npm or yarn
- Internet connection for fetching USGS data and map tiles
