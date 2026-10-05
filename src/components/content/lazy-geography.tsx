"use client";

import dynamic from "next/dynamic";

/**
 * The finder and region map carry the prefecture map paths. Every MDX article module imports the shared MDX
 * components, so without these async boundaries their chunk loads on each route that reads article modules.
 * Server rendering still produces their HTML; the browser fetches the code only where a map is rendered.
 */
export const LazyPrefectureFinder = dynamic(() => import("./prefecture-finder").then((module) => module.PrefectureFinder));
export const LazyJapanRegionMapView = dynamic(() => import("./japan-region-map").then((module) => module.JapanRegionMapView));
