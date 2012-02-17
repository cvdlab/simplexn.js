
/*!
 * simplexn
 * dimension-independent geometric kernel based on simplicial complex
 * Copyright (c) 2011 cvd-lab <cvd-lab@email.com> (https://github.com/cvd-lab/)
 * MIT License
 */

!(function (exports) {

  /**
   * Variables.
   */

  var undefined
    , cos = Math.cos
    , sin = Math.sin
    ;


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
    return this.vertices.subarray(index, index + this.dim);
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
    this.vertices.set(vertex, index);
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
    var vertices = this.vertices
      , length = vertices.length
      , dim = this.dim
      , i = 0
      , p
      ;

    while (i < length) {
      p = new Float32Array(vertices.subarray(i, i += dim));
      iterator(p);
    }

    return this;
  };

  /**
   * map
   * 
   * @param {Function} iterator
   * @return {simplex.PointSet} a new point set
   * @api public
   */

  simplexn.PointSet.prototype.map = function (iterator) {
    var vertices = new Float32Array(this.vertices)
      , length = vertices.length
      , dim = this.dim
      , i = 0
      , point
      , pointset
      ;

    while (i < length) {
      p = new Float32Array(vertices.subarray(i, i += dim));
      vertices.set(iterator(p));
    }

    pointset = new PointSet(vertices, dim);
    
    return pointset;
  };

  /**
   * filter
   * 
   * @param {Function} iterator
   *   
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
   * @param {Number} angle
   * @return {simplex.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.rotate = function (dims, angle) {
    var vertices = this.vertices
      , length = vertices.length
      , dim = this.dim
      , cos_a = cos(angle)
      , sin_a = sin(angle)
      , r_ii = cos_a
      , r_ij = -sin_a
      , r_ji = sin_a
      , r_jj = cos_a
      , d_i = dims[0]
      , d_j = dims[1]
      , v_i
      , v_j
      , i
      , j
      , k
      ;

    for (k = 0; k < length; k += dim, i = k + d_i, j = k + d_j) {
      v_i = vertices[i];
      v_j = vertices[j];
      vertices[i] = v_i * r_ii + v_j * r_ij;
      vertices[j] = v_i * r_ji + v_j * r_jj;
    }
    
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
    var vertices = this.vertices 
      , length = vertices.length
      , dim = this.dim
      , i
      , j
      ;

    for (i = 0; i < length; i += dim) {
      for (j = 0: j < dims; j += 1) {
        vertices[i+dims[j]] *= values[j]; 
      }
    }
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
    var vertices = this.vertices 
      , length = vertices.length
      , dim = this.dim
      , i
      , j
      ;

    for (i = 0; i < length; i += dim) {
      for (j = 0: j < dims; j += 1) {
        vertices[i+dims[j]] += values[j]; 
      }
    }
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
    var old_dim = this.dim
      , min_dim = Math.min(old_dim, dim);
      , old_vertices = this.vertices
      , old_length = vertices.length
      , length = old_length / old_dim * dim
      , vertices = new Float32Array(length)
      , i
      , j
      , k
      ;

    for (i = 0, j = 0; i < length; i += dim, j += old_dim) {
      for (k = 0; k < min_dim; k += 1) {
        vertices[i + k] = old_vertices[j + k];
      }
    }    
    
    return this;
  };


}(this));