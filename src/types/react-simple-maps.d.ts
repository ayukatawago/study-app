declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      [key: string]: any;
    };
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }

  export interface GeographiesProps {
    geography: string | { features: any[] };
    children: (_: { geographies: any[] }) => React.ReactNode;
    parseGeographies?: (_: any[]) => any[];
    [key: string]: any;
  }

  export interface GeographyProps {
    geography: any;
    className?: string;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
      [key: string]: React.CSSProperties | undefined;
    };
    [key: string]: any;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    [key: string]: any;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}
