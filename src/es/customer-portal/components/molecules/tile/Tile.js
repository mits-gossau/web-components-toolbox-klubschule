// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'

/**
* @export
* @class AppointmentTile
* @type {CustomElementConstructor}
*/
export default class AppointmentTile extends Tile {
  /**
   * renders the css
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
      :host {}
      :host > div {
        display:flex;
        flex-direction: column;
        padding-bottom:1em;
      }
      :host .parent {
        display:flex;
        align-items: stretch;
      }
      :host .course-info, .course-booking {
        flex-basis: 50%;
      }
      :host .course-admin, .course-price {
        flex-grow: 1;
        flex-shrink: 1;
      }

      :host .course-price {
        text-align:right;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {
       
        }

      }
    `
    // return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  // fetchTemplate () {
  //   const styles = [
  //     {
  //       path: `${this.importMetaUrl}../../../components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
  //       namespace: false
  //     },
  //     {
  //       path: `${this.importMetaUrl}../../../components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
  //       namespaceFallback: true
  //     }
  //   ]
  //   switch (this.getAttribute('namespace')) {
  //     case 'tile-default-':
  //       return this.fetchCSS([
  //         {
  //           path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
  //           namespace: false
  //         }, ...styles])
  //     default:
  //       return super.fetchTemplate()
  //   }
  // }

  /**
   * Render HTML
   * @returns Promise<void>
  */
  renderHTML () {
    // console.log(this.getAttribute('data'))
    const content = Tile.parseAttribute(this.getAttribute('data'))
    // super.renderHTML()
    this.appointmentWrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = this.renderTile(content)
    // this.html = /* HTML */`
    // <div class="m-tile">
    //   <div class="m-tile__wrap">
    //     <div class="m-tile__overlay"></div>
    //     <div class="m-tile__head">
    //       <span class="m-tile__title">${content?.courseTitle} (${content?.courseType}_${content?.courseId})</span>
    //     </div>
    //   </div>
    // </div>
    // `
  }

  renderTile (content) {
    return /* html */ `
      <div class="m-tile">
        <div class="parent">
          <div class="course-info">
            <p>${content.courseTitle} (${content.courseType}_${content.courseId})</p>
            <p>${this.formatCourseAppointmentDate(content.courseAppointmentDate)}</p>
            <p>${content.courseAppointmentTimeFrom} - ${content.courseAppointmentTimeTo}</p>
          </div>
          <div class="course-admin">
            <p>${content.courseAppointmentFreeSeats} freie Plätze</p>
            <p>${content.instructorDescription}</p>
            <p>${content.courseLocation} <br /> Raum: ${content.roomDescription}</p>
          </div>
        </div>
        <div class="parent">
          <div class="course-booking">BOOKING BTN</div>
          <div class="course-price">
            <span>${content.lessonPrice}</span>
          </div>
        </div>
      </div>

    `
  }

  formatCourseAppointmentDate (date) {
    const dateObject = new Date(date)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    const formattedDate = formatter.format(dateObject)
    return formattedDate
  }
}
