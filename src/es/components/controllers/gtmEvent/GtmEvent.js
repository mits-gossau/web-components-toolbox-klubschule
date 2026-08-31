/* global sessionStorage */
// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * GTMEvent
 * An example at Migros Pro: src/es/components/pages/TrackingTest.html
 *
 * @export
 * @class GTMEvent
 * @type {CustomElementConstructor}
 * @attribute {
 *  {listen-to} 'click', 'change', 'on-page-load'
 *  {event-data} {...} object to be pushed to the dataLayer
 * }
 * @example {
    <ks-c-gtm-event event-data='{
       "event": "register",
       "action": "started",
       "step": "1"
     }'>
       <a-button namespace="button-primary-">Register started</a-button>
    </ks-c-gtm-event>
 * }
 */

export default class GTMEvent extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
    this.sendEvent = this.sendEvent.bind(this)
  }

  connectedCallback() {
    const eventType = this.getAttribute('listen-to')
    switch (eventType) {
      case 'click':
        this.addEventListener('click', this.sendEvent)
        break
      case 'change':
        this.root.querySelectorAll('*').forEach(child => {
          child.addEventListener('change', this.sendEvent)
        })
        break
      case 'on-page-load':
        this.sendEvent()
        break
      default:
        console.error('Invalid event type: ' + eventType)
        break
    }
  }

  disconnectedCallback() {
    const eventType = this.getAttribute('listen-to')
    switch (eventType) {
      case 'nav-level-item':
        this.querySelectorAll('ks-m-nav-level-item').forEach(child => {
          child.removeEventListener('click', this.sendEvent)
        })
        break
      case 'filter':
        this.querySelectorAll('*').forEach(child => {
          child.removeEventListener('change', this.sendEvent)
          child.removeEventListener('click', this.sendEvent)
        })
        break
      case 'click':
        this.removeEventListener('click', this.sendEvent)
        break
      case 'change':
        this.root.querySelectorAll('*').forEach(child => {
          child.removeEventListener('change', this.sendEvent)
          child.removeEventListener('click', this.sendEvent)
        })
        break
    }
  }

  sendEvent(event) {
    this.eventData = JSON.parse(this.getAttribute('event-data'))

    this.eventData = GTMEvent.addTrackingContextToEvent(
      this.eventData,
      this.getAttribute('tracking-context')?.trim() || undefined,
      this.eventData.event === 'select_item' ? GTMEvent.getPageType() : undefined
    )

    if (event?.target?.name) {
      this.eventData[event.target.name] = event.target.value
    }
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(this.eventData)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    } else {
      setTimeout(() => this.sendEvent(), 100)
    }
  }

  static getTrackingContext () {
    try {
      return sessionStorage.getItem('ks_tracking_context') || 'default'
    } catch (e) {
      return 'default'
    }
  }

  static setTrackingContext (context) {
    try {
      sessionStorage.setItem('ks_tracking_context', context)
    } catch (e) {
      console.error('Failed to set tracking context:', e)
    }
  }

  static getTrackingItemListName () {
    try {
      return sessionStorage.getItem('ks_tracking_item_list_name')
    } catch (e) {
      return null
    }
  }

  static setTrackingItemListName (itemListName) {
    try {
      if (itemListName) {
        sessionStorage.setItem('ks_tracking_item_list_name', itemListName)
      } else {
        sessionStorage.removeItem('ks_tracking_item_list_name')
      }
    } catch (e) {
      console.error('Failed to set tracking item list name:', e)
    }
  }

  static getPageType () {
    if (typeof window === 'undefined' || !Array.isArray(window.dataLayer)) return null
    for (let i = window.dataLayer.length - 1; i >= 0; i--) {
      if (window.dataLayer[i]?.pageType) return window.dataLayer[i].pageType
    }
    return null
  }

  static addTrackingContextToEvent (eventData, trackingContext, trackingItemListName) {
    const isSelectItem = eventData.event === 'select_item'
    if (isSelectItem) {
      const normalizedTrackingContext = trackingContext?.trim()
      if (normalizedTrackingContext) GTMEvent.setTrackingContext(normalizedTrackingContext)
      if (trackingItemListName !== undefined) GTMEvent.setTrackingItemListName(trackingItemListName)
    }
    if (!eventData.ecommerce?.items) return eventData

    const itemCurrency = eventData.ecommerce.items.find(item => item.currency)?.currency
    if (!eventData.ecommerce.currency && itemCurrency) eventData.ecommerce.currency = itemCurrency
    const prefersStoredItemListName = [
      'begin_checkout',
      'add_shipping_info',
      'add_payment_info',
      'purchase'
    ].includes(eventData.event)
    eventData.ecommerce.items = eventData.ecommerce.items.map(item => {
      const normalizedItem = { ...item }
      delete normalizedItem.currency
      if (!isSelectItem) return GTMEvent.addTrackingContextToItem(normalizedItem, prefersStoredItemListName)
      delete normalizedItem.item_list_id
      delete normalizedItem.item_list_name
      return normalizedItem
    })
    if (eventData.ecommerce.value === undefined && eventData.ecommerce.items[0]?.price !== undefined) {
      eventData.ecommerce.value = eventData.ecommerce.items[0].price
    }

    if (isSelectItem) {
      eventData.ecommerce.item_list_id = GTMEvent.getTrackingContext()
      const itemListName = GTMEvent.getTrackingItemListName()
      if (itemListName) eventData.ecommerce.item_list_name = itemListName
      else delete eventData.ecommerce.item_list_name
    }

    return eventData
  }

  static addTrackingContextToItem (item, preferStoredItemListName = false) {
    const itemListName = GTMEvent.getTrackingItemListName()
    const enrichedItem = {
      item_list_id: GTMEvent.getTrackingContext(),
      ...(itemListName ? { item_list_name: itemListName } : {}),
      ...item
    }
    if (preferStoredItemListName && itemListName) enrichedItem.item_list_name = itemListName
    return enrichedItem
  }
}
