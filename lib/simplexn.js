
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

  /**
   * PointSet
   * 
   * @constructor
   * @param {Array|Float32Array} vertices
   * @param {Number} dim
   * @api public
   */

  simplexn.PointSet = function (vertices, dim) {
    this.vertices = new Float32Array(vertices);
    this.dim = dim;
  };

  /**
   * merge
   * Filter duplicated and overlapped vertices 
   * according to precision parameter (10e-7 by default).
   * 
   * @param {Number} [precision = 10e-4] 
   * @return {Float32Array} inidices mapping changes
   * @api public
   */

  simplexn.PointSet.prototype.merge = function (precision) {
    var precision = precision || 10e-4
      , vertices = this.vertices
      , length = vertices.length
      , dim = this.dim
      , indices = new Uint32Array(length/dim)
      , newVertices = new Float32Array(length)
      , usedIndices = 0
      , usedCoords = 0
      , vertexAdded
      , equals
      , i
      , j
      , k
      ;

    precision = precision.toString().length - 1;

    for (i = 0; i < length; i += dim) {
      vertexAdded = false;
      for (j = 0; j < usedCoords && !vertexAdded; j += dim) {
        equals = true;
        for (k = 0; k < dim; k += 1) {
          vertices[i+k] = +vertices[i+k].toFixed(precision);
          equals &= vertices[i+k] === newVertices[j+k];
        }
        vertexAdded |= equals; 
      }
      indices[i/dim] = !vertexAdded ? usedIndices : j/dim-1;
      if (!vertexAdded) {
        for (k = 0; k < dim; k += 1) {
          newVertices[usedCoords+k] = vertices[i+k];
        }
        usedIndices += 1;
        usedCoords = usedIndices*dim;
      }
    }

    this.vertices = newVertices.subarray(0, usedCoords);

    return indices;
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