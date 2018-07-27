class Utils {
  static hasClass(element, className) {
    return new RegExp('\\b' + className + '\\b').test(element.className);
  }

  static addClass(element, className) {
    if(!this.hasClass(element, className))
      element.className += ` ${className}`;
  }

  static removeClass(element, className) {
    if(this.hasClass(element, className))
      element.className = element.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '').trim();
  }

  static define(obj, key, val) {
		if(!(key in obj)) {
			try {
				if(val !== undefined)
					Object.defineProperty(obj, key, { value: val });
			} catch(e) {}
		}
  }
  
  static createElement(tagName, htmlProperties, cssProperties) {
    let element = document.createElement(tagName);

    for(let property in htmlProperties)
      element[property] = htmlProperties[property];

    for(let property in cssProperties)
      element.style[property] = cssProperties[property];

    return element;
  }
}

export default Utils;