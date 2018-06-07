import 'hammerjs';
import {Component, NgZone, ViewChild} from '@angular/core';
import {environment} from "../environments/environment";
import DrawingControlOptions = google.maps.drawing.DrawingControlOptions;
import OverlayType = google.maps.drawing.OverlayType;
import MarkerOptions = google.maps.MarkerOptions;
import {} from '@types/googlemaps';
import {MarkersSet, ShadowShape, ShadowShapeSet} from "./MarkersSet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  title = 'shadowow';
  shadowShapesSet: ShadowShapeSet;


  constructor(private _ngZone: NgZone) {

  }

  ngOnInit() {
    var selectedShape;
    var selectedColor;
    var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];

    var mapProp = {
      center: new google.maps.LatLng(environment.initLat, environment.initLng),
      zoom: 20,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };


    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.setTilt(0);
    this.shadowShapesSet = new ShadowShapeSet(this.map);

    this.map.addListener('center_changed', () => {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      console.log(this.map.getCenter().lat() + " " + this.map.getCenter().lng())


    });
    const drawingControlOptions: DrawingControlOptions = {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [OverlayType.RECTANGLE, OverlayType.POLYGON, OverlayType.POLYLINE]
    };
    const markerOptions: MarkerOptions = {
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      position: new google.maps.LatLng(environment.initLat, environment.initLng)
    };
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions,
      markerOptions,
      polygonOptions: {
        fillColor: '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 3,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      }
    });


    const shadowShapesSet = this.shadowShapesSet;

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);

        shadowShapesSet.onShapeAdded(e.overlay, this._ngZone);
      }
    });
    drawingManager.setMap(this.map);

  }


}