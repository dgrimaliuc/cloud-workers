export class OrderedMap {
  /**
   *
   * @param {*} orderedMap - An object with map and keys properties.
   * @param {*} reversed - A boolean to determine the order of the keys.
   * When true, the keys are in reverse order and elements are added on first position.
   */
  constructor(orderedMap) {
    this.reversed = orderedMap?.reversed || true;
    this.map = orderedMap?.map ?? {}; // Stores the key-value pairs
    this.keys = orderedMap?.keys ?? []; // Keeps the order of keys
  }

  /**
   * Add or update an entry in the map.
   * @param {string} key - The key for the value.
   * @param {*} value - The value to store.
   */
  set(key, value) {
    if (this.map.hasOwnProperty(key)) {
      // If key already exists, move it to the start of the order array
      this.delete(key);
    }
    this.#push(key);
    this.map[key] = value;
  }

  /**
   * Check if the map is empty.
   * @returns {boolean} True if the map is empty, false otherwise.
   * */
  isEmpty() {
    return this.keys.length === 0;
  }

  /**
   * Internal method to add a key-value pair to the map.
   * @param {*} key - The key to add.
   * @param {*} value - The value to add.
   */
  #push(key, value) {
    if (this.reversed) {
      this.keys.unshift(key);
    } else {
      this.keys.push(key);
    }
    this.map[key] = value;
  }

  /**
   * Get the complete list of ordered values.
   * @returns {Array} List of content in the order they were added.
   */
  getOrdered() {
    return this.keys.map((key) => this.map[key]);
  }

  /**
   * Get the value associated with a key.
   * @param {string} key - The key to retrieve the value for.
   * @returns {*} The value associated with the key, or undefined if not found.
   */
  get(key) {
    return this.map[key];
  }

  /**
   * Check if a key exists in the map.
   * @param {string} key - The key to check.
   * @returns {boolean} True if the key exists, false otherwise.
   */
  has(key) {
    return this.map.hasOwnProperty(key);
  }

  /**
   * Remove an entry from the map.
   * @param {string} key - The key of the entry to remove.
   */
  delete(key) {
    if (this.map.hasOwnProperty(key)) {
      delete this.map[key];
      const index = this.keys.indexOf(key);
      if (index !== -1) {
        this.keys.splice(index, 1); // Remove key from the order array
      }
    }
  }

  /**
   * Get the keys in insertion order.
   * @returns {Array} An array of keys in insertion order.
   */
  keysOrdered() {
    return this.keys;
  }

  /**
   * Clear the map.
   */
  clear() {
    this.map = {};
    this.keys = [];
  }

  /**
   * Get the size of the map.
   * @returns {number} The number of key-value pairs in the map.
   */
  size() {
    return this.keys.length;
  }

  /**
   * Iterate over the entries in insertion order.
   * @param {Function} callback - A function to execute for each entry.
   */
  forEach(callback) {
    this.keys.forEach((key) => {
      callback(key, this.map[key]);
    });
  }
}
