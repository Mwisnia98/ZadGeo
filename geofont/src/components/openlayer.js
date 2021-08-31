import { useEffect, useState } from 'react'
import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import '../style/map.css'


import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';



const Openlayer = (props) => {
    const [map, setMap] = useState();
    
    const image = new CircleStyle({
        radius: 5,
        fill: null,
        stroke: new Stroke({color: 'red', width: 1}),
      });
      
      const styles = {
        'Point': new Style({
          image: image,
        }),
        'LineString': new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
        }),
        'MultiLineString': new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
        }),
        'MultiPoint': new Style({
          image: image,
        }),
        'MultiPolygon': new Style({
          stroke: new Stroke({
            color: 'yellow',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)',
          }),
        }),
        'Polygon': new Style({
          stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        }),
        'GeometryCollection': new Style({
          stroke: new Stroke({
            color: 'magenta',
            width: 1,
          }),
          fill: new Fill({
            color: 'magenta',
          }),
          image: new CircleStyle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
              color: 'magenta',
            }),
          }),
        }),
        'Circle': new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255,0,0,0.2)',
          }),
        }),
      };


      
    
     

    useEffect(() => {
        Mapss();
    },[props]);
    
    const Mapss = () => {

        

        if(props.jsonObj !== null)
        {
          const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(JSON.stringify(props.jsonObj)),
            
          });

          const styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
          };
          
          const vectorLayer = new VectorLayer({
            
            source: vectorSource,
            style: styleFunction,
          });

        const map = new Map({
        layers: [
            new TileLayer({
            source: new OSM(),
            }),
            vectorLayer,
        ],
        target: "map",
        view: new View({
            projection: props.jsonObj.crs.properties.name,
            center: [0, 0],
            zoom: 1,
            
        }),
        })


        const info = document.getElementById('info');
        function showInfo(event) {
        const features = map.getFeaturesAtPixel(event.pixel);
        if (features.length == 0) {
            info.innerText = '';
            info.style.opacity = 0;
            return;
        }
        const properties = features[0].getProperties();
        const {geometry, ...newobj } = properties;
        
        info.innerText = JSON.stringify(newobj, null, 2);
        info.style.opacity = 1;
        }
        map.on('pointermove', showInfo);
        setMap(map);
        
    }
    };
    
    const ZoomOut = () => {
      const view = map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom - 1);
    };
    
    const ZoomIn = () => {
      const view = map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom + 1);
    };

    
    
    

    


    return (
        <div className="mapwithbutton">
            <a className="skiplink" href="map">Go to map</a>
            <div id="map" className="map" tabIndex="0">
            <pre id="info"/>

            </div>
            <div className="btns">
            <button onClick={ZoomOut}>Zoom out</button>
            <button onClick={ZoomIn}>Zoom in</button>
            </div>
        </div>
    )
    
}

export default Openlayer
