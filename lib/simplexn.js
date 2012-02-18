
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

  /**
   * flat
   * Return a flat version of the given array of arrays.
   * 
   * @param {Array} arrays
   * @return {Array} array
   * @api private
   */

  simplexn._flat = function (arrays) {
    var res = [];

    arrays.forEach(function (item) {
      res = res.concat(item);
    });

    return res;
  };

  /**
   * PointSet
   * 
   * @constructor
   * @param {Array|Float32Array} vertices
   * @param {Number} dim
   * @api public
   */

  simplexn.PointSet = function (vertices, dim) {
    var vertices = vertices || [[]]
      , dim = dim || vertices[0].length
      ;

    vertices = vertices instanceof Array ? simplexn._flat(vertices) : vertices;
    this.vertices = new Float32Array(vertices);
    this.dim = dim;
  };

  /**
   * equals 
   * 
   * @param {simplexn.PointSet} pointSet
   * @return {Boolean} true if this is equals to the given point set, false otherwise.
   * @api public
   */

  simplexn.PointSet.prototype.equals = function (pointSet) {
    var vertices1 = this.vertices
      , vertices2 = pointSet.vertices
      , dim1 = this.dim
      , dim2 = pointSet.dim
      , length1 = vertices1.length
      , length2 = vertices2.length
      ;

    if (dim1 !== dim2) return false;
    if (length1 !== length2) return false;
    
    while (--length1) {
      if (vertices1[length1] !== vertices2[length1]) return false;
    }

    return true;
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
   * @return {simplexn.PointSet} this for chaining
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
   * @return {simplexn.PointSet} this for chaining
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
   * @return {simplexn.PointSet} a new point set
   * @api public
   */

  simplexn.PointSet.prototype.map = function (iterator) {
    var vertices = this.vertices
      , length = vertices.length
      , new_vertices = new Float32Array(length)
      , dim = this.dim
      , i = 0
      , point
      , pointset
      ;

    while (i < length) {
      point = new Float32Array(vertices.subarray(i, i += dim));
      new_vertices.set(iterator(p));
    }

    pointset = new PointSet(new_vertices, dim);
    
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
    var vertices = this.vertices
      , length = vertices.length
      , newVertices = new Float32Array(length)
      , dim = this.dim
      , i = 0
      , j = 0
      , point
      , pointset
      ;

    for (i = 0; i < length; i += dim) {
      point = new Float32Array(vertices.subarray(i, i + dim));
      if (iterator(point)) {
        newVertices.set(point, j);
        j += dim;
      }
    }

    pointset = new simplexn.PointSet(newVertices.subarray(0, j), dim);
    
    return pointset;
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
    var precision = precision || 1e-4
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

    for (i = 0; i < length; i += dim) {
      vertexAdded = false;
      for (j = 0; j < usedCoords && !vertexAdded; j += dim) {
        equals = true;
        for (k = 0; k < dim; k += 1) {
          vertices[i+k] = Math.round(vertices[i+k]/precision)*precision;
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
   * @param {Number} angle
   * @return {simplexn.PointSet} this for chaining
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
   * @return {simplexn.PointSet} this for chaining
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
      for (j = 0; j < dims; j += 1) {
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
   * @return {simplexn.PointSet} this for chaining
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
      for (j = 0; j < dims; j += 1) {
        vertices[i+dims[j]] += values[j]; 
      }
    }
    return this;
  };

  /**
   * transform
   * 
   * @param {Array|Float32Array} matrix
   * @return {simplexn.PointSet} this for chaining
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
   * @return {simplexn.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.embed = function (dim) {
    var dim = dim || this.dim + 1
      , old_dim = this.dim
      , min_dim = Math.min(old_dim, dim)
      , old_vertices = this.vertices
      , old_length = old_vertices.length
      , length = old_length / old_dim * dim
      , vertices = new Float32Array(length)
      , i
      , j
      , k
      ;

    for (i = 0, j = 0; i < old_length; i += old_dim, j += dim) {
      for (k = 0; k < min_dim; k += 1) {
        vertices[j + k] = old_vertices[i + k];
      }
    }

    this.vertices = vertices;
    this.dim = dim;
    
    return this;
  };

  /**
   * _computeFaces
   * 
   * @param {Array} arrays
   * @return {Array} array
   * @api private
   */

  simplexn._computeFaces = function (arrays) {

  };

  /**
   * SimplicialComplex
   * 
   * @constructor
   * @param {Array|Float32Array} vertices
   * @faces {Array|Uint32Array} faces
   * @param {Number} [dim]
   * @api public
   */

  simplexn.SimplicialComplex = function (vertices, faces, dim) {
    var dim  = dim || 0
      , vartices = vertices || []
      , faces = faces || 0
      ;

    dim || 0;
    this.vertices = new PontSet(vertices, dim);
    this.faces = simplexn._computeFaces(faces, dim);
  };

  /**
   * rotate
   * 
   * @param {Array|Uint32Array} dims
   * @param {Number} angle
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.rotate = function (dims, angle) {
    this.vertices.rotate(dims, angle);
    return this;
  };

  /**
   * scale
   * 
   * @param {Array|Uint32Array} dims
   * @param {Array|Float32Array} values
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.scale = function (dims, values) {}

  /**
   * translate
   * 
   * @param {Array|Uint32Array} dims
   * @param {Array|Float32Array} values
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.translate = function (dims, values) {
    this.vertices.translate(dims, values);
    return this;
  };

  /**
   * transform
   * 
   * @param {Array|Float32Array} matrix
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.transform = function (matrix) {};

  /**
   * embed
   * 
   * @param {Number} dim
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.embed = function (dim) {};

  /**
   * clone
   * 
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.clone = function () {};

  /**
   * map
   * 
   * @param {Function} mapping
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.map = function (mapping) {};

  /**
   * extrude
   * 
   * @param {Array|Float32Array} hlist
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.extrude = function (hlist) {};

  /**
   * explode
   * 
   * @param {Array|Uint32Array} dims
   * @param {Array|Float32Array} values
   * @return {simplexn.PointSet} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.explode = function (dims, values) {};

  /**
   * skeleton
   * 
   * @param {Number} dim
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.skeleton = function (dim) {};

  /**
   * boundary
   * 
   * @param {Number} dim
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.boundary = function (dim) {};

}(this));