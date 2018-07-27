class Alter {
  static prepend(newChild, refChild) {
    refChild.insertBefore(newChild, refChild.firstChild);
  }

  static before(newChild, refChild) {
    refChild.parentNode.insertBefore(newChild, refChild);
  }

  static after(newChild, refChild) {
    refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
  }

  static unmount(element) {
    element.parentNode.removeChild(element);
  }

  static replace(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }
}

export default Alter;