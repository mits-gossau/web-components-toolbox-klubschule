// @ts-check
import GoogleMaps from '../../web-components-toolbox/src/es/components/atoms/googleMaps/GoogleMaps.js'
/* global self */

/**
 *
 * @export
 * @class GoogleMaps
 * @type {CustomElementConstructor}
 * @attribute {}
 * @css {}
 */
export default class KsGoogleMaps extends GoogleMaps {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.currentPopup = null
  }

  renderCSS () {
    super.renderCSS()

    this.css = /* css */ `
      :host {
        --pop-up-window-top: -3.5em;
        --pop-up-window-left: auto;
        --pop-up-window-right: 5rem;
        --pop-up-window-bottom: auto;
        --pop-up-window-before-top: 2em;
        --pop-up-window-before-left: auto;
        --pop-up-window-before-right: -1.75em;
        --pop-up-window-before-bottom: auto;
        --pop-up-window-before-rotation: 90deg;
      }
    `
  }

  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../molecules/popUpWindow/PopUpWindow.js`,
        name: 'ks-m-pop-up-window'
      },
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/contactRow/ContactRow.js`,
        name: 'ks-m-contact-row'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(() => {
      let element = null

      let htmlContent = '' // Initialize the HTML content as an empty string

      if (this.iframeUrl) {
        // Note: this part is copied from the original parent class...
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
        const color = self.getComputedStyle(this.root.querySelector('*')).getPropertyValue('--color-secondary')

        const mapDiv = document.createElement('div')
        mapDiv.setAttribute('id', 'map')
        this.loadDependency().then(googleMap => {
          const map = this.createMap(googleMap, mapDiv, this.lat, this.lng)
          const locations = JSON.parse(this.getAttribute('locations'))

          const Popup = this.createPopupClass(googleMap)

          const markers = locations.map((location) => {
            return this.addMarkerWithPopup({
              googleMap,
              map,
              location,
              Popup
            })
          })

          const clusterRenderer = {
            render ({ count, position }) {
              return new googleMap.Marker({
                label: { text: String(count), color: "white", fontSize: "20px" },
                position,
                icon: {
                  path: googleMap.SymbolPath.CIRCLE,
                  scale: 18,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeWeight: 0
                },
                // adjust zIndex to be above other markers
                zIndex: Number(googleMap.Marker.MAX_ZINDEX) + count
              })
            }
          }

          // Add a marker clusterer to manage the markers.
          this.loadMarkerClustererDependency().then(markerClusterer => {
            new markerClusterer.MarkerClusterer({ markers, map, renderer: clusterRenderer })
          })

          this.createControls(map, googleMap)

          // set map bounds to switerland
          const switzerlandBounds = new googleMap.LatLngBounds({ lat: 45.817995, lng: 5.9559113 }, { lat: 47.8084648, lng: 10.4922941 })
          map.fitBounds(switzerlandBounds)
        })
        element = mapDiv
      }

      // Set the final HTML content to the container element
      this.html = this.iframeUrl ? htmlContent : element

      // As I need to render the popup as a "bottom sheet" outside of the map on mobile
      // additionally add a popup container for mobile
      this.html = /* html */`<div id="mobile-maps-popup-container"></div>`
    })
  }

  addMarkerWithPopup ({
    googleMap,
    map,
    location,
    Popup
  }) {
    // css vars don't seem to work directly inside the icon so I am getting the color via js
    const color = self.getComputedStyle(this.root.querySelector('*')).getPropertyValue('--color-secondary')

    const marker = new googleMap.Marker({
      position: { lat: location.lat, lng: location.lng },
      icon: {
        path: 'M11.5 32C11.5 32 23 20.4803 23 11.5203V11.5197C23 8.46445 21.7885 5.53431 19.632 3.37399C17.4754 1.21368 14.5511 0 11.5006 0C8.45014 0 5.52516 1.21368 3.36805 3.37459C1.21154 5.53491 0 8.46505 0 11.5203C0 20.4797 11.5 32 11.5 32ZM14.3409 8.94203C15.7626 10.5142 15.6425 12.9427 14.0738 14.3663C12.5044 15.7905 10.0807 15.6708 8.65906 14.0986C7.2374 12.5265 7.35687 10.0986 8.92623 8.6744C10.4956 7.25022 12.9193 7.36991 14.3409 8.94203Z',
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
        anchor: new googleMap.Point(
          12,
          32
        )
      },
      map,
      title: location.title
    })

    const latLng = new googleMap.LatLng(location.lat, location.lng)

    const popup = new Popup(
      latLng,
      /* html */`<div>
        <h4>${location.name}</h4>
        <hr />
        <ks-m-contact-row
          name="${location.name}"
          street="${location.address}"
          icon-name="Location"
        >
        </ks-m-contact-row>
        <ks-m-contact-row
          name="${location.phone}"
          icon-name="Phone"
          href="tel:${location.phone}"
        >
        </ks-m-contact-row>
        <ks-a-button namespace="button-primary-" color="secondary" href="${location.href}" style="width: 100%">
          Zum Center
          <a-icon-mdx icon-name="ArrowRight" size="1em" class="icon-right" icon-size="16x16"></a-icon-mdx>
        </ks-a-button>
      </div>`,
      false,
      this.root.querySelector('#mobile-maps-popup-container')
    )
    popup.setMap(map)

    marker.addListener('click', () => {
      map.panTo(marker.getPosition())
      if (this.currentPopup) {
        this.currentPopup.hide()
      }
      this.currentPopup = popup
      popup.show()
    })

    return marker
  }

  createPopupClass (googleMap) {
    const mobileBreakpoint = parseInt(this.mobileBreakpoint)

    return class Popup extends googleMap.OverlayView {
      position
      containerDiv
      isShown
      constructor (position, content, show, mobilePopupContainer) {
        super()
        this.position = position
        this.isShown = show
        this.mobilePopupContainer = mobilePopupContainer
        this.popupInnerHTML = `<ks-m-pop-up-window show=${this.isShown.toString()}>${content}</ks-m-pop-up-window>`

        // This zero-height div is positioned at the bottom of the bubble.
        const bubbleAnchor = document.createElement('div')

        bubbleAnchor.classList.add('popup-bubble-anchor')
        bubbleAnchor.innerHTML = this.popupInnerHTML
        bubbleAnchor.style.marginLeft = '40px'
        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement('div')
        this.containerDiv.classList.add('popup-container')
        this.containerDiv.appendChild(bubbleAnchor)
        this.containerDiv.style.position = 'absolute'
        this.containerDiv.style.width = '200px'
        this.containerDiv.style.width = '0px'

        // Optionally stop clicks, etc., from bubbling up to the map.
        Popup.preventMapHitsAndGesturesFrom(this.containerDiv)
      }

      /** Called when the popup is added to the map. */
      onAdd () {
        this.getPanes().floatPane.appendChild(this.containerDiv)
      }

      /** Called when the popup is removed from the map. */
      onRemove () {
        if (this.containerDiv.parentElement) {
          this.containerDiv.parentElement.removeChild(this.containerDiv)
        }
      }

      /** Called each frame when the popup needs to draw itself. */
      draw () {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        )
        // Hide the popup when it is far out of view.
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? 'block'
            : 'none'

        if (display === 'block') {
          this.containerDiv.style.left = divPosition.x + 'px'
          this.containerDiv.style.top = divPosition.y + 'px'
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display
        }
      }

      show () {
        if (window.innerWidth < mobileBreakpoint) {
          this.mobilePopupContainer.innerHTML = this.popupInnerHTML
          this.mobilePopupContainer.querySelector('ks-m-pop-up-window')?.setAttribute('show', 'true')
        } else {
          const popupElement = this.containerDiv.querySelector('ks-m-pop-up-window')
          popupElement?.setAttribute('show', 'true')
        }
      }

      hide () {
        this.containerDiv.querySelector('ks-m-pop-up-window')?.setAttribute('show', 'false')
        this.mobilePopupContainer.innerHTML = ''
      }
    }
  }

  /**
   * fetch dependency
   *
   * @returns {Promise<{components: any}>}
   */
  loadMarkerClustererDependency () {
    // @ts-ignore
    self.initMap = () => { }

    return new Promise(resolve => {
      const markerClustererScript = document.createElement('script')
      markerClustererScript.setAttribute('type', 'text/javascript')
      markerClustererScript.setAttribute('async', '')
      markerClustererScript.setAttribute('src', 'https://unpkg.com/@googlemaps/markerclusterer@2.5.3/dist/index.min.js')
      markerClustererScript.onload = () => {
        // @ts-ignore
        if ('google' in self) resolve(self.markerClusterer)
      }
      this.html = markerClustererScript
    })
  }

  createMap (googleMap, mapTarget, lat, lng) {
    return new googleMap.Map(mapTarget, {
      center: { lat, lng },
      zoom: 15,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      panControl: true
    })
  }

  createControls (map, googleMapsLibrary) {
    const buttons = /* html */`
    <ks-a-button icon namespace="button-primary-" color="secondary" id="gm-btn-center"><a-icon-mdx icon-name="Navigation" size="1em"></a-icon-mdx></ks-a-button>
    <ks-a-button icon namespace="button-primary-" color="secondary" id="gm-btn-zoom-in"><a-icon-mdx icon-name="Plus" size="1em"></a-icon-mdx></ks-a-button>
    <ks-a-button icon namespace="button-primary-" color="secondary" id="gm-btn-zoom-out"><a-icon-mdx icon-name="Minus" size="1em"></a-icon-mdx></ks-a-button>
    `
    const container = document.createElement('div')
    container.style.margin = '1rem'
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '0.5rem'

    container.innerHTML = buttons

    const centerButton = container.querySelector('#gm-btn-center')
    const zoomInButton = container.querySelector('#gm-btn-zoom-in')
    const zoomOutButton = container.querySelector('#gm-btn-zoom-out')

    zoomInButton?.addEventListener('click', () => {
      map.setZoom(map.getZoom() + 1)
    })
    zoomOutButton?.addEventListener('click', () => {
      map.setZoom(map.getZoom() - 1)
    })
    centerButton?.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const userLocation = new googleMapsLibrary.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(userLocation)
          map.setZoom(14)
        })
      } else {
        /* Browser doesn't support Geolocation */
        console.error('Browser does not support geolocation')
      }
    })

    map.controls[googleMapsLibrary.ControlPosition.RIGHT_BOTTOM].push(container)
  }
}
