# World Countries

This directory is reserved for any custom country map images that might be needed in future implementations.

## Current Implementation

The current implementation does not use static image files. Instead, it uses the react-simple-maps library to render interactive maps directly in the browser, with countries highlighted based on their ISO-3166-1 numeric codes.

The map data is loaded from a CDN:
```javascript
// From src/components/map/WorldMap.tsx
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
```

## Future Enhancements

If you need to add custom country maps or enhanced visualizations in the future, you can place them in this directory using the following naming convention:

- Use the country's ISO-3166-1 numeric code as the filename (e.g., `840.png` for USA)
- Use consistent dimensions (recommended: 800x400 pixels)
- Use transparent backgrounds for better integration