# World Map Data

This directory is used for any custom geographic data for the world country flashcard system.

## Current Implementation

The application uses a CDN-hosted world map data source from jsDelivr:

```javascript
// Source in src/components/map/WorldMap.tsx
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
```

## Country Codes

The application uses the following numeric ISO-3166-1 country codes:

| Country | Code | Capital |
|---------|------|---------|
| USA | 840 | Washington D.C. |
| UK | 826 | London |
| France | 250 | Paris |
| Germany | 276 | Berlin |
| Italy | 380 | Rome |
| Spain | 724 | Madrid |
| China | 156 | Beijing |
| Japan | 392 | Tokyo |
| India | 356 | New Delhi |
| Brazil | 076 | Brasilia |
| Australia | 036 | Canberra |
| Canada | 124 | Ottawa |
| Russia | 643 | Moscow |
| South Africa | 710 | Pretoria |
| Egypt | 818 | Cairo |

These codes correspond to the `id` property in the TopoJSON geography objects.