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
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../molecules/contactRow/ContactRow.js`,
        name: 'ks-m-contact-row'
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
        const mapDiv = document.createElement('div')
        mapDiv.setAttribute('id', 'map')
        this.loadDependency().then(googleMap => {
          const map = this.createMap(googleMap, mapDiv, this.lat, this.lng)
          const locations = JSON.parse(this.getAttribute('locations'))

          const Popup = this.createPopupClass(googleMap)

          locations.forEach((location) => {
            this.addMarkerWithPopup({
              googleMap,
              map,
              location,
              Popup
            })
          })

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
      this.html = '<div id="mobile-maps-popup-container"></div>'
    })
  }

  addMarkerWithPopup ({
    googleMap,
    map,
    location,
    Popup
  }) {
    const marker = new googleMap.Marker({
      position: { lat: location.lat, lng: location.lng },
      // icon: this.markerIcon
      map,
      title: location.title
    })

    const latLng = new googleMap.LatLng(location.lat, location.lng)

    const popup = new Popup(
      latLng,
      /* html */`<div>
        <strong>${location.name}</strong>
        <hr />
        <br />
        <ks-m-contact-row
          name="${location.name}"
          street="${location.address}"
          icon-name="Home"
          href="#"
        >
        </ks-m-contact-row>
        <ks-m-contact-row
          name="${location.phone}"
          icon-name="Phone"
          href="tel:${location.phone}"
        >
        </ks-m-contact-row>
        <ks-a-button namespace="button-primary-" color="secondary" href="${location.href}" style="width: 100%">Zum Center</ks-a-button>
      </div>`,
      false,
      this.root.querySelector('#mobile-maps-popup-container')
    )
    popup.setMap(map)

    marker.addListener('click', () => {
      if (this.currentPopup) {
        this.currentPopup.hide()
      }
      this.currentPopup = popup
      popup.show()
    })
  }

  createPopupClass (googleMap) {
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
        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement('div')
        this.containerDiv.classList.add('popup-container')
        this.containerDiv.appendChild(bubbleAnchor)
        this.containerDiv.style.position = 'absolute'
        this.containerDiv.style.width = '200px'

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
        const popupElement = this.containerDiv.querySelector('ks-m-pop-up-window')
        popupElement?.setAttribute('show', 'true')
        this.mobilePopupContainer.innerHTML = this.popupInnerHTML
        this.mobilePopupContainer.querySelector('ks-m-pop-up-window')?.setAttribute('show', 'true')
      }

      hide () {
        this.containerDiv.querySelector('ks-m-pop-up-window')?.setAttribute('show', 'false')
        this.mobilePopupContainer.innerHTML = ''
      }
    }
  }
}
