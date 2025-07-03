export interface BaseSetting<T> {
  /**
   * String literal value type used to differentiate between the different
   * possible setting types
   */
  type: string;
  name: string;
  description: string;
  /**
   * Default Value for this setting on first use
   */
  defaultValue: T;
  /**
   * If your setting needs to be synchronized with external systems on change,
   * and not just app internal UI changes.
   */
  onChange?: (newValue: T, oldValue: T) => unknown;
}
