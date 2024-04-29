// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'
/* global self */

/**
 *
 * @export
 * @class GoogleMaps
 * @type {CustomElementConstructor}
 * @attribute {}
 * @css {}
 */
export default class GoogleMaps extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.MAP_URL = `https://maps.googleapis.com/maps/api/js?v=weekly&key=${this.apiKey}&callback=initMap`
    this.DEFAULT_COORDINATES = { lat: 47.375600, lng: 8.675320 }
    if (!this.iframeUrl) {
      this.googleMapTransport = event => {
        const eventTarget = event.target
        const windowOpen = position => {
          const saddr = position && position.coords ? `&saddr=${position.coords.latitude},${position.coords.longitude}` : ''
          // dirflg driving did not work as expected, it has no id for that reason
          self.open(`https://www.google.com/maps?daddr=${this.lat},${this.lng}${saddr}${eventTarget.id ? `&dirflg=${eventTarget.id}` : eventTarget.parentElement && eventTarget.parentElement.id ? `&dirflg=${eventTarget.parentElement.id}` : ''}`, '_blank')
        }
        navigator.geolocation.getCurrentPosition(windowOpen, windowOpen)
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.transportIcons) {
      this.transportIcons.forEach(transportIcon => {
        transportIcon.addEventListener('click', this.googleMapTransport)
      })
    }
  }

  disconnectedCallback () {
    this.transportIcons.forEach(transportIcon => {
      transportIcon.removeEventListener('click', this.googleMapTransport)
    })
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.scripts.length
  }

  renderCSS () {
    this.css = /* css */` 
    :host {
       display:var(--display, block);
       position:var(--position, relative);
       width: var(--width, 100%) !important;
    }
    :host > #map {
      width: var(--map-width, 100%);
      height: var(--map-height, 75vh);
    }  
    :host > hr {
      display: none;
    }
    :host .control-events {
      background-color: #fff;
      box-shadow: 2px 2px 2px -2px #999;
      height: 81px;
      padding: 0 12px 0 0;
      position: absolute;
      right: 70px;
      top: 455px;
      width: 220px;
      z-index: 1;
    }
    :host .control-events > div {
      margin:6px 0 6px 6px;
    }
    :host .mapOverlay{
      background: transparent; 
      position:var(--map-overlay-position, absolute); 
      width:var(--width, 100%);
      height:var(--height, 75vh);
      margin-top: - var(--map-overlay-margin-top, 75vh);
      top: var(--map-overlay-top, 0);
      pointer-events: auto;
      
    }

    :host iframe {
      border:var(--border, none);
      width:var(--width, 100%);
      height:var(--height, 75vh);
    }
    @media only screen and (max-width: _max-width_) {
      :host {
        display: flex !important;
        flex-direction: column;
      }
      :host > #map {
        height: var(--map-height-mobile, 25vh);
        order: 1;
        width: var(--map-width-mobile, 100%);
      }  
      :host > hr {
        display: block;
        order: 3;
        width: var(--hr-width, 200px);
      }
      :host .control-events{
        box-shadow: none;
        height: 70px;
        order: 2;
        padding: 15px 0 0 0;
        position: static;
        width: 100%;
      }
      :host .control-events > div {
        margin:0 0 6px var(--control-events-div-margin-left-mobile, 0);
      }
    }`
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    const styles = [{
      // @ts-ignore
      path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
      namespaceFallback: true
    }]

    switch (this.getAttribute('namespace')) {
      case 'google-maps-default-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./default-/default-.css`,
          namespace: false
        }, ...styles], false)
      case 'google-maps-iframe-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./iframe-/iframe-.css`,
          namespace: false
        }, ...styles], false)
      default:
        return Promise.resolve()
    }
  }

  renderHTML () {
    let element = null

    let htmlContent = '' // Initialize the HTML content as an empty string

    if (this.iframeUrl) {
      if (this.scrollZoom) {
        const overlayDiv = document.createElement('div')
        overlayDiv.setAttribute('class', 'mapOverlay')
        overlayDiv.setAttribute('onClick', "style.pointerEvents='none'")
        htmlContent += overlayDiv.outerHTML // Add the overlayDiv to the HTML content
      }

      const iframe = document.createElement('iframe')
      iframe.src = this.iframeUrl
      iframe.name = 'map'
      element = iframe
      htmlContent += element.outerHTML // Add the iframe to the HTML content
    } else {
      const mapDiv = document.createElement('div')
      mapDiv.setAttribute('id', 'map')
      this.loadDependency().then(googleMap => {
        const map = this.createMap(googleMap, mapDiv, this.lat, this.lng)
        // this.setMarker(googleMap, map, this.lat, this.lng)
        const locations = JSON.parse(this.getAttribute('locations'))

        console.log(locations)

        class Popup extends googleMap.OverlayView {
          position;
          containerDiv;
          constructor(position, content) {
            super();
            this.position = position;
            console.log('this.position', this.position)

            // This zero-height div is positioned at the bottom of the bubble.
            const bubbleAnchor = document.createElement("div");

            bubbleAnchor.classList.add("popup-bubble-anchor");
            bubbleAnchor.innerHTML = content;
            // This zero-height div is positioned at the bottom of the tip.
            this.containerDiv = document.createElement("div");
            this.containerDiv.classList.add("popup-container");
            this.containerDiv.appendChild(bubbleAnchor);
            this.containerDiv.style.position = 'absolute'
            this.containerDiv.style.background = 'green'
            this.containerDiv.style.width = '200px'
            
            // Optionally stop clicks, etc., from bubbling up to the map.
            Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
          }
          /** Called when the popup is added to the map. */
          onAdd() {
            this.getPanes().floatPane.appendChild(this.containerDiv);
          }
        /** Called when the popup is removed from the map. */
        onRemove() {
            if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }
        /** Called each frame when the popup needs to draw itself. */
        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
            this.position,
            );
            // Hide the popup when it is far out of view.
            const display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
                ? "block"
                : "none";

            if (display === "block") {
            this.containerDiv.style.left = divPosition.x + "px";
            this.containerDiv.style.top = divPosition.y + "px";
            }
    
            if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
            }
        }
        }

        Object.keys(locations).forEach(location => {
          // this.setMarker(googleMap, map, locations[location].lat, locations[location].lng)
          const infowindow = new googleMap.InfoWindow({
            content: `<div class="info-box">${locations[location].title} info-window</div>`,
            ariaLabel: locations[location].title
          })

          const marker = new googleMap.Marker({
            position: { lat: locations[location].lat, lng: locations[location].lng },
            // icon: this.markerIcon
            map: map,
            title: locations[location].title
          })

          const latLng = new googleMap.LatLng(locations[location].lat, locations[location].lng)
          console.log(latLng, locations[location].lat, locations[location].lng)

          const popup = new Popup(
            latLng,
            `<div>${locations[location].title}</div>`
          );
          popup.setMap(map);

          marker.addListener('click', () => {
            console.log('clicked on ' + locations[location].title)

            infowindow.open({
              anchor: marker,
              map
            })
          })
        })

        // set map bounds to switerland
        const bounds = new googleMap.LatLngBounds({lat: 45.817995, lng: 5.9559113}, {lat: 47.8084648, lng: 10.4922941} )
        console.log(bounds, googleMap)
        map.fitBounds(bounds)
      })
      element = mapDiv
    }
  
    // Set the final HTML content to the container element
    this.html = this.iframeUrl ? htmlContent : element
  }

  /**
   * fetch dependency
   *
   * @returns {Promise<{components: any}>}
   */
  loadDependency () {
    // @ts-ignore
    self.initMap = () => { }

    return new Promise(resolve => {
      const googleMapScript = document.createElement('script')
      googleMapScript.setAttribute('type', 'text/javascript')
      googleMapScript.setAttribute('async', '')
      googleMapScript.setAttribute('src', this.MAP_URL)
      googleMapScript.onload = () => {
        // @ts-ignore
        if ('google' in self) resolve(self.google.maps)
      }
      this.html = googleMapScript
    })
  }

  createMap (googleMap, mapTarget, lat, lng) {
    return new googleMap.Map(mapTarget, {
      center: { lat, lng },
      zoom: 15,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
      panControl: true,
      styles: [{
        featureType: 'landscape',
        stylers: [{ saturation: -100 }, { lightness: 60 }]
      }, {
        featureType: 'road.local',
        stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
      }, {
        featureType: 'transit',
        stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
      }, {
        featureType: 'administrative.province',
        stylers: [{ visibility: 'off' }]
      }, {
        featureType: 'water',
        stylers: [{ visibility: 'on' }, { lightness: 30 }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ visibility: 'off' }]
      }, {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
      }, {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }]
    })
  }

  setMarker (googleMap, map, lat, lng) {
    const marker = new googleMap.Marker({
      position: { lat, lng },
      icon: this.markerIcon
    })
    marker.setMap(map)
    marker.setAnimation(4)
  }

  get scripts () {
    return this.root.querySelectorAll('script')
  }

  get lat () {
    return Number(this.getAttribute('lat')) || this.DEFAULT_COORDINATES.lat
  }

  get lng () {
    return Number(this.getAttribute('lng')) || this.DEFAULT_COORDINATES.lng
  }

  get transportIcons () {
    const wrapper = this.root.querySelector('o-wrapper')
    if (!wrapper) return
    return wrapper.root ? wrapper.root.querySelectorAll('a') : wrapper.querySelectorAll('a')
  }

  get apiKey () {
    return this.getAttribute('api-key') || ''
  }

  get markerIcon () {
    return this.getAttribute('marker-icon')
  }

  get iframeUrl () {
    return this.getAttribute('iframe-url') || ''
  }

  get scrollZoom () {
    return this.getAttribute('scrollZoom') || 'true'
  }
}
