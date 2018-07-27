class Component {
  constructor(settings) {
    this.settings = settings;
  }

  configure(fn) {
    fn(this.settings);
  }

  attachEvents() {}

  init() {}

  dispose() {}
}

export default Component;