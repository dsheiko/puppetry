/**
 * Get round nested ternary operator
 *
 * <header>{
 *   accept()
 *    .when( a == 1, <h1>Case 1</h1>)
 *    .when( a == 2, <h1>Case 2</h1>)
 *    .otherwise( <h1>Case 3</h1>)
 *    .render()
 *  }</header>
 */

class Accept {

  constructor() {
    this.node = null;
  }
  /**
   * Render reactNode if expression in `predicate` resolves in true
   * @param {Boolean} predicate
   * @param {React.ReactNode} reactNode
   * @returns {Accept}
   */
  when( predicate, reactNode ) {
    if ( predicate ) {
      this.node = reactNode;
    }
    return this;
  }

  /**
   * Render reactNode when not matches were found so far
   * @param {React.ReactNode} reactNode
   * @returns {Accept}
   */
  otherwise( reactNode ) {
    if ( !this.node ) {
      this.node = reactNode;
    }
    return this;
  }

  /**
   * Resolve chain
   * @returns {React.ReactNode}
   */
  render() {
    return this.node;
  }
}

export default function accept() {
  return new Accept();
}