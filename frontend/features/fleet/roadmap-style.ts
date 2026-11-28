import { mapTokens } from "@/components/ui/map-tokens";
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import type { Locale } from "@/lib/i18n";

// Cartographic colors belong to the basemap, independently of the application's theme.
const landColors: Readonly<Record<string, string>> = {
  park: mapTokens.park,
  landcover_wood: mapTokens.wood,
  landcover_grass: mapTokens.grass,
  landcover_wetland: mapTokens.wetland,
  landuse_pitch: mapTokens.park,
  landuse_track: mapTokens.grass,
  landuse_cemetery: mapTokens.grass,
  landuse_residential: mapTokens.residential,
  water: mapTokens.water,
  building: mapTokens.building,
};

function referencesName(value: unknown): boolean {
  if (typeof value === "string") return /^\{name(?::[\w-]+|_[\w-]+)?\}$/.test(value);
  if (!Array.isArray(value)) return false;
  if (value[0] === "get" && typeof value[1] === "string" && /^name(?::[\w-]+|_[\w-]+)?$/.test(value[1])) return true;
  return value.some(referencesName);
}

function roadmapLayer(layer: LayerSpecification, locale: Locale): LayerSpecification {
  if (layer.type === "background") return { ...layer, paint: { ...layer.paint, "background-color": mapTokens.background } };
  if (layer.type === "fill" && landColors[layer.id]) return { ...layer, paint: { ...layer.paint, "fill-color": landColors[layer.id] } };
  if (layer.type === "line") {
    if (layer["source-layer"] === "waterway") return { ...layer, paint: { ...layer.paint, "line-color": mapTokens.water } };
    // Keep the provider's widths, casing, tunnel dashes and rail symbology.
    if (/^(road|bridge|tunnel)_/.test(layer.id) && layer["source-layer"] === "transportation" && !/rail/.test(layer.id)) {
      return { ...layer, paint: { ...layer.paint, "line-color": layer.id.endsWith("_casing") ? mapTokens.roadCasing : mapTokens.road } };
    }
  }
  if (layer.type === "symbol" && referencesName(layer.layout?.["text-field"])) {
    // OpenMapTiles may omit an Arabic/English translation. Retain real local names.
    const names = locale === "ar"
      ? ["name:ar", "name", "name:nonlatin", "name:latin", "name_en"]
      : ["name:en", "name", "name_en", "name:latin", "name:nonlatin"];
    const text: ExpressionSpecification = ["coalesce", ...names.map((name): ExpressionSpecification => ["get", name])];
    return { ...layer, layout: { ...layer.layout, "text-field": text } };
  }
  return layer;
}

/** Adapt only the selected Liberty style; caller leaves custom provider styles alone. */
export function localizeRoadmapStyle(style: StyleSpecification, locale: Locale): StyleSpecification {
  return {
    ...style,
    // Flat roadmap at every zoom; no low-zoom shaded-relief raster.
    layers: style.layers.filter(layer => layer.id !== "natural_earth").flatMap((layer): LayerSpecification[] => {
      const styled = roadmapLayer(layer, locale);
      if (layer.id !== "landcover_grass" || layer.type !== "fill" || style.layers.some(candidate => candidate.id === "landcover_farmland")) return [styled];
      // Liberty omits farmland; OpenMapTiles exposes it in the landcover layer.
      return [styled, {
        ...layer, id: "landcover_farmland", filter: ["==", ["get", "class"], "farmland"],
        paint: { ...layer.paint, "fill-color": mapTokens.grass, "fill-opacity": 0.55 },
      }];
    }),
  };
}
