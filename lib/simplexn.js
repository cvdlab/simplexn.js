
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
   * @param {Number} [precision = 10e-7] 
   * @return {Float32Array} inidices mapping changes
   * @api public
   */

  simplexn.PointSet.prototype.merge = function (precision) {
    var precision = precision || 10e-7
      , vertices = this.vertices
      , length = vertices.length
      , used = length
      , dim = this.dim
      , indices = new Float32Array(length/dim)
      , newVertices
      , i
      , j
      , k
      , equalsFound
      ;

    precision = precision.toString().length - 2;

    for (i = 0; i < length; i += 1) {
      vertices[i] = +vertices[i].toFixed(precision);
    }

    for (i = 0; i < length; i += dim) {
      for (j = i+1; j < length && ! equalsFound; j += dim) {
        equalsFound = true;
        for (k = 0; k < dim; k += 1) {
          equalsFound &= vertices[i+k] === vertices[j+k];
        }
      }
      if (equalsFound) {
        for (k = 0; k < dim; k += 1) {
          vertices[i+k] = null;
        }
        indices[i] = j;
        used -= dim;
      }
    }

    newVertices = new Float32Array(used);
    k = 0;
    for (i = 0; i < length; i += 3) {
      if (vertices[i]) {
        for (j = 0; j < dim; j += 1) {
          newVertices[k+j] = vertices[i+j];
        }
        for (j = 0; j < length; j += 1) {
          if (indices[j] === 1) {
            indices[j] = k;
          }
        }
        k += 1;
      }
      
      
    }

    this.vertices = newVertices;

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