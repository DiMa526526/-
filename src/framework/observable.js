export default class Observable {
  #observers = new Set();

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  _notyfi(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
