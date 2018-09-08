import Utils from './Utils';

let ep = Element.prototype;
let s = 'atchesSelector';
Utils.define(Element.prototype, 'matches', ep['matches'] || ep['m' + s] || ep['mozM' + s]
	|| ep['oM' + s] || ep['webkitM' + s] || ['msM' + s]);

class Traversal {
  static prev(element, selector) {
    if(selector) {
      let first = element;

      while(first = first.previousElementSibling) {
        if(first.matches(selector))
          return first;
      }

      return null;
    }

    return element.previousElementSibling;
  }

  static next(element, selector) {
    if(selector) {
      let first = element;

      while(first = first.nextElementSibling) {
        if(first.matches(selector))
          return first;
      }

      return null;
    }

    return element.nextElementSibling;
  }

  static parents(element, selector) {
    let first = element;

    while(first = first.parentNode) {
      if(first === document)
        return null;
        
      if(first.matches(selector))
        return first;
    }

    return null;
  }
}

export default Traversal;