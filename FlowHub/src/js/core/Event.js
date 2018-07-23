class Event {
  static trigger(element, event) {
    if(document.createEvent) {
      let e = document.createEvent('HTMLEvents');
      e.initEvent(event, false, true);
      element.dispatchEvent(e);
    } else {
      let e = document.createEventObject();
      e.eventType = event;
      element.fireEvent('on' + e.eventType, e);
    }

  }
}

export default Event;