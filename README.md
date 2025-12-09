# Mapping Seattle Housing

**Group Members:** Jacob Cash, Megan Cheung, Kristy Dang, Sumaya Mohamud, Chufang Wang  

***

## Description
This interactive web GIS application helps users explore affordable housing options near the University of Washington and surrounding Seattle neighborhoods. The map combines multiple data layers to visualize housing affordability, rent prices, neighborhood safety, and transit accessibility. Users can interact with the map using filters, pop-ups, and sidebar charts to make informed housing decisions.  

***

## Project Goal
The goal of this project is to provide an intuitive tool for UW students and young professionals to identify neighborhoods that fit their budget and lifestyle. By visualizing rent prices, crime patterns, affordability zones, and proximity to transit, users can easily compare options and plan their housing search.  

***

## Favicon
![Purple Animated House Favicone](assets/favi.png)  
*Custom purple-and-yellow UW-themed house icon representing Seattle student housing.*

***

## Application URL
[https://kridang.github.io/seattle-housing-map/](https://kridang.github.io/seattle-housing-map/)

***

## Map Preview


- **Overview Map:** Shows housing affordability, MHA Zones, transit, and crime across Greater Seattle.  
- **Crime Clusters:** Visualizes crime incidents using clusters to reduce clutter.  
- **Transit Access:** Highlights areas within walking distance of bus and Link stations. Hights distance between lightrail and UW Campus.

***

## Data Sources
- **Apartment Market Rent Prices (2024)** – U.S. Census Tract level: [Catalog Data](https://catalog.data.gov/dataset/apartment-market-rent-prices-by-census-tract)  
- **Mandatory Housing Affordability Zones** – Seattle City GIS: [MHA Zones](https://data-seattlecitygis.opendata.arcgis.com/datasets/mandatory-housing-affordability-mha-zones/explore)  
- **SPD Crime Data (2008–Present)** – Seattle Open Data: [Crime Data](https://data.seattle.gov/Public-Safety/SPD-Crime-Data-2008-Present/tazs-3rd5/about_data)  
- **Transit Stops & Walksheds** – Half-mile walkshed from frequent stops: [Transit Data](https://data.seattle.gov/dataset/Frequent-Transit-Stop-Half-Mile-Walksheds-Interim-/w6b7-awkr/about_data)
- **Transit Lightrail** – Half-mile walkshed from frequent stops: [Transit Data](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::light-rail-stations-1/explore)

***

## Applied Libraries and Web Services
- **Mapbox GL JS** – for base map and thematic layers  
- **Turf.js** – for spatial calculations (buffers, distances)  
- **GitHub Pages** – hosting the application and GeoJSON data  

***

## Main Functions / Filters
- **Price Filter:** Select desired rent range to highlight affordable neighborhoods  
- **Crime Filter:** Show areas with low or high crime density  
- **Transit Proximity:** Highlight walking distance to bus or Link stations from UW
- **Interactive Pop-ups:** Display neighborhood details, crime info, and transit access, walking distances  
- **Choropleth & Cluster Layers:** Visualize rent distribution and crime points efficiently  

***

## Acknowledgements

We'd like to thank the City of Seattle and King County for making open GIS data available.
Special thanks to the GEOG 328 instructors and TAs for guidance throughout the project.  

***

## AI Usage Disclosure
ChatGPT was used to produce the favicon for this project. It was also used to help refine the README markdown structure. All code and data processing performed by the group.

***

## Other Notes
- The map is designed to work on desktop and laptop screens
- Future improvements may include user accounts, bookmarking favorite neighborhoods, filtering bus stops, and additional interactive filters for amenities.
- Limitation: This data reflects reported crimes in Seattle over the last year. Not all incidents are reported, and patterns may be influenced by policing practices, neighborhood demographics, and other systemic factors.
- Limitation: This map displays bus stop locations as points, but does not encode route paths or service frequency. The visualization assumes that users have prior knowledge of how individual bus stops connect into routes and how service operates beyond stop locations.  
