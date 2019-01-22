class BaseSelector {
  constructor(graphicSelectionManager) {
    this.type = 'base';
    this.gsm = graphicSelectionManager;
  }

  destroy() {}

}

export default BaseSelector;