
/*!
 * simplexn
 * dimension-independent geometric kernel based on simplicial complex
 * Copyright (c) 2011 cvd-lab <cvd-lab@email.com> (https://github.com/cvd-lab/)
 * MIT License
 */

!(function (exports) {

  /**
   * Library namespace.
   */
  var simplexn = exports.simplexn = {};

  /**
   * Library version.
   */

  simplexn.version = '0.0.0';


  simplexn.PointSet = function (vertices, dim, precision) {
    this.vertices = new Float32Array(vertices);
    this.dim = dim;
    this.indices = new Float32Array(vertices.length);
    this.precision = precision || 10e-7;
  };

  /**
   * get
   * 
   * @param {Number} index
   * @return {Float32Array} the indexed vertex
   * @api public
   */

  simplexn.PointSet.prototype.get = function (index) {
    // body...
  };

  /**
   * set
   * 
   * @param {Number} index
   * @param {Array|Float32Array} vertex
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.set = function (index, vertex) {
    // body...

    return this;
  };

  /**
   * forEach
   * 
   * @param {Function} iterator
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.forEach = function (iterator) {
    // body...

    return this;
  };

  /**
   * map
   * 
   * @param {Function} iterator
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.map = function (iterator) {
    // body...

    return this;
  };

  /**
   * filter
   * 
   * @param {Function} iterator
   * @return {Float32Array} new filtered PointSet
   * @api public
   */

  simplexn.PointSet.prototype.filter = function (iterator) {
    // body...

    return this;
  };

  /**
   * merge
   * 
   * @param {Number} precision
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.merge = function (precision) {
    // body...

    return this;
  };

  /**
   * rotate
   * 
   * @param {Array|Uint32Array} dims
   * @param {Array|Float32Array} values
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.rotate = function (dims, values) {
    // body...
    
    return this;
  };

  /**
   * scale
   * 
   * @param {Array|Uint32Array} dims
   * @param {Array|Float32Array} values
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.scale = function (dims, values) {
    // body...
    
    return this;
  };

  /**
   * translate
   * 
   * @param {Array|Uint32Array} dims
   * @param {Array|Float32Array} values
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.translate = function (dims, values) {
    // body...
    
    return this;
  };

  /**
   * transform
   * 
   * @param {Array|Float32Array} matrix
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.transform = function (matrix) {
    // body...
    
    return this;
  };

  /**
   * embed
   * 
   * @param {Number} dim
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.embed = function (dim) {
    // body...
    
    return this;
  };


}(this));