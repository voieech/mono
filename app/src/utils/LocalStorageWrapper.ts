import { localStorage } from "./localStorage";

/**
 * Local Storage wrapper for 1 specific data type and key
 */
export abstract class LocalStorageWrapper<T> {
  abstract readonly _storageKey: string;
  abstract readonly _defaultValue: T;

  /**
   * Returns data in localStorage. This will run a side effect of writing
   * default value to localStorage if no data is read the first time.
   */
  async read() {
    const [err, data] = await localStorage.read<T>(this._storageKey);

    if (err !== null) {
      // Only on first use, since data not in local storage yet, we will write
      // the default value in
      if (err.name === localStorage.notFoundErrorName) {
        await this.resetToDefault();

        // Assumes that the reset worked and just return the default value
        // directly instead of reading from storage again and potentially
        // causing a crash loop.
        return this._defaultValue;
      }

      // If it is some other unknown error, re-throw it!
      throw err;
    }

    return data;
  }

  update(value: T) {
    return localStorage.write(this._storageKey, value);
  }

  resetToDefault() {
    return this.update(this._defaultValue);
  }
}
