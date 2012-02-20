
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

  var cos = Math.cos;
  var sin = Math.sin;
  var round = Math.round;


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
   * @param {Array} points
   * @api public
   */

  simplexn.PointSet = function (points) {
    points = points || [[]];
    this.size = points.length;
    this.rn = points[0].length;
    this.points = new Float32Array(simplexn._flat(points));
  };

  /** 
   * clone
   * 
   * @return {PointSet} clone
   * @api public
   */

  simplexn.PointSet.prototype.clone = function () {
    var clone = new simplexn.PointSet();
    clone.size = this.size;
    clone.rn = this.rn;
    clone.points = new Float32Array(this.points);
    return clone;
  };

  /**
   * equals 
   * 
   * @param {simplexn.PointSet} pointSet
   * @return {Boolean} true if this is equals to the given point set, false otherwise.
   * @api public
   */

  simplexn.PointSet.prototype.equals = function (other) {
    if (this.rn !== other.rn || this.size !== other.size) return false;
    for (var i = 0, l = this.points.length; i < l; i += 1) {
      if (this.points[i] !== other.points[i]) {
        return false;
      }
    }
    return true;
  };


  /**
   * get
   * 
   * @param {Number} index
   * @return {Float32Array} the indexed point
   * @api public
   */

  simplexn.PointSet.prototype.get = function (index) {
    var rn = this.rn;
    var begin = index * rn;
    var end = begin + rn;

    return this.points.subarray(begin, end);
  };

  /**
   * set
   * 
   * @param {Number} index
   * @param {Array|Float32Array} point
   * @return {simplexn.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.set = function (index, point) {
    this.points.set(point, index * this.rn);
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
    var points = this.points;
    var length = vertices.length;
    var rn = this.rn;
    var i, j;

    for (i = j = 0; i < length; i += rn, j += 1) {
      iterator(vertices.subarray(i, i + rn), j);
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
    var points = this.points;
    var length = points.length;
    var rn = this.rn;
    var i, j;

    for (i = j = 0; i < length; i += dim, j += 1) {
      vertices.set(iterator(vertices.subarray(i, i + dim), j), i);
    } 
    
    return this;
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
    var points = this.points;
    var length = points.length;
    var filtered = new Float32Array(length);
    var rn = this.rn;
    var i, j, k;
    var point;
    var pointset;

    for (i = j = k = 0; i < length; i += rn, j += 1) {
      point = points.subarray(i, i + rn);
      if (iterator(point, j)) {
        filtered.set(point, k);
        k += rn;
      }
    }

    filtered = filtered.subarray(0, k);
    pointset = new simplexn.PointSet();
    pointset.points = filtered;
    pointset.rn = rn;
    pointset.size = k / rn;
    
    return pointset;
  };

  /**
   * merge
   * Filter duplicated and overlapped vertices 
   * according to precision parameter (10e-4 by default).
   * 
   * @param {Number} [precision = 10e-4] 
   * @return {Float32Array} inidices mapping changes
   * @api public
   */

  simplexn.PointSet.prototype.merge = function (precision) {
    var precision = precision || 1e-4
      , vertices = this.points
      , length = vertices.length
      , dim = this.rn
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
    var points = this.points
      , length = points.length
      , rn = this.rn
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
      v_i = points[i];
      v_j = points[j];
      points[i] = v_i * r_ii + v_j * r_ij;
      points[j] = v_i * r_ji + v_j * r_jj;
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
    var points = this.points 
      , length = points.length
      , rn = this.rn
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
   * _areEqual
   * 
   * @param {Array|Float32Array|Uint32Array} a1
   * @param {Array|Float32Array|Uint32Array} a2
   * @return {Boolean} true if each item of a1 is === to correspond element of a2
   * @api private
   */

  simplexn._areEqual = function (a1, a2) {
    var a1Len = a1.length;
    var a2Len = a2.length;
    var i;

    if (a1Len === a2Len) {
      return false;
    }

    for (i = 0; i < a1Len; i++) {
      if (a1[i] === a2[i]) {
        return false;
      }
    }
 
    return true;
  };

  /**
   * _computeTopology
   * 
   * @param {Array} arrays
   * @return {Array[Uint32Array]} topology
   * @api private
   */

  simplexn._computeTopology = function (faces, dim) {
    var dim = dim || faces[0].length - 1
      , res = new Array(dim)
      , nFacesMaxDim
      , facesMaxDim
      , sup
      , temp
      , len
      , nFaces
      , lenFace
      , d
      , f
      , i
      , j
      , k
      , is1
      , is2
      ;

    res[0] = new Uint32Array();

    if (typeof faces[0] === "number") {
      nFacesMaxDim = faces.length / dim;
      facesMaxDim = faces;
    } else {
      nFacesMaxDim = faces.length
      facesMaxDim = simplexn._flat(faces);
    }

    res[dim] = new Uint32Array(facesMaxDim);

    for (d = dim; d > 1; d--) {
      sup = res[d];
      len = sup.length;
      lenFace = d + 1;
      nFaces = len / lenFace;
      temp = new Uint32Array(lenFace * nFaces * d);
      res[d-1] = temp;
      k = 0;
      for (f = 0; f < len; f += lenFace) {
        for (i = 0; i < lenFace; i++) {
          for (j = 0; j < lenFace; j++) {
            if (i != j) {
              temp[k] = sup[f+j];
              k++;
            }
          }
          if (i & 1) { // is odd
            is1 = k-lenFace+1;
            is2 = k-1;
            temp[is1] ^= temp[is2];
            temp[is2] ^= temp[is1];
            temp[is1] ^= temp[is2];
          }
        }
      }
    }

    return res;
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
    var dim = dim || vertices[0].length 
      , vartices = vertices || []
      , faces = faces || []
      ;

    this.dim = dim;
    this.vertices = new simplexn.PointSet(vertices, dim);
    this.topology = simplexn._computeTopology(faces, dim);
    this.faces = this.topology[dim];
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

  simplexn.SimplicialComplex.prototype.scale = function (dims, values) {
    this.vertices.scale(dims, values);
    return this;
  };

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

  simplexn.SimplicialComplex.prototype.transform = function (matrix) {
    this.vertices.transform(matrix);
    return this;
  };

  /**
   * embed
   * 
   * @param {Number} dim
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.embed = function (dim) {
    this.vertices.embed(dim);
    return this;
  };

  /**
   * clone
   * 
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.clone = function () {
    var simplicialcomplex = new simplexn.SimplicialComplex();
    simplicialcomplex.vertices = this.vertices.clone();
    return this;
  };

  /**
   * map
   * 
   * @param {Function} mapping
   * @param {Boolean} merge
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.map = function (mapping, merge) {
    this.vertices.map(mapping);
    if (merge) this.vertice.merge();
    return this;
  };

  /**
   * equals 
   * 
   * @param {simplexn.SimplicialComplex} simpcomp
   * @return {Boolean} true if this is equals to the given mplicial complex, false otherwise.
   * @api public
   */

  simplexn.SimplicialComplex.prototype.equals = function (simpcomp) {
    var vertices1 = this.vertices
      , vertices2 = simpcomp.vertices
      , topology1 = this.topology
      , topology2 = simpcomp.topology
      , dim1 = topology1.length
      , dim2 = topology2.length
      , length1 = vertices1.length
      , length2 = vertices2.length
      ;

    if (! vertices1.equals(vertices2)) return false;
    if (dim1 !== dim2) return false;
    
    while (--dim1) {
      if (! simplexn._areEqual(topology1[dim1],topology2[dim1])) return false;
    }

    return true;
  };

/**
   * extrude
   * 
   * @param {Array|Float32Array} hlist which must be made by positive numbers or by an alternation of positive and negative numbers
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.extrude = function (hlist) {
    var hlist = hlist || [];
    var nHeights = hlist.length;
    var nPosHeights = hlist.filter(function (h) {return h >= 0}).length;
    var dim = this.dim;
    var newDim = dim + 1;
    var vertices = this.vertices.vertices; // CHE BRUTTO!!
    var verticesLen = vertices.length;
    var nVertices =  verticesLen / dim;
    var topology = this.topology;
    var maxFacesDim = topology.length;
    var faces = this.faces;
    var facesLen = faces.length;
    var nFaces = facesLen / maxFacesDim;
    var abs = Math.abs;
    var newVertices = new Float32Array((nHeights+1)*newDim*nVertices);
    var newFaces = new Uint32Array(nPosHeights*nFaces*newDim*(newDim+1));
    var tempDim = 2*maxFacesDim;
    var temp = new Uint32Array(tempDim);
    var res;
    var h, f, v, i, j;
    var indx;
    var fIndx = 0 ;
    var start, end, ei1, ei2;
    var height = 0;

    this.embed();
    vertices = this.vertices.vertices;
    verticesLen = vertices.length;
    newVertices.set(vertices);

    for (h = 0; h < nHeights; h++) {
      height += abs(hlist[h]);

      // add new vertices
      newVertices.set(vertices, (h+1)*verticesLen);
      start = (h+1) * verticesLen + newDim - 1;
      end = (h+2) * verticesLen + newDim - 1; // (h+1) * verticesLen + nVertices * (dim + 1) + 1;
      for (v = start; v < end; v += newDim) {
        newVertices[v] = height;
      }

      // create new faces
      if (hlist[h] >= 0) {
        for (f = 0; f < nFaces; f++) {
          // fill temp with selected indexes
          for (i = 0; i < maxFacesDim; i++) {
            indx = faces[f*maxFacesDim+i] + h * nVertices;
            temp[i] = indx;
            temp[i+maxFacesDim] = indx + nVertices;
          }
          // pick faces from temp, maxFacesDim by maxFacesDim
          for (i = 0; i < maxFacesDim; i++) {
            end = i + maxFacesDim + 1;
            for (j = i; j < end; j++) {
              newFaces[fIndx++] = temp[j];
            }
            // take care of orientation
            if (((maxFacesDim - 1) * i) & 1) {
              ei1 = fIndx - 1;
              ei2 = fIndx - (maxFacesDim + 1);
              newFaces[ei1] ^= newFaces[ei2];
              newFaces[ei2] ^= newFaces[ei1];
              newFaces[ei1] ^= newFaces[ei2];
            }
          }
        }
      }
    }

    this.vertices = new simplexn.PointSet(newVertices, newDim);
    this.faces = newFaces;
    this.topology = simplexn._computeTopology(newFaces, newDim);
    this.dim = newDim;
    return this;
  };

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

  simplexn.SimplicialComplex.prototype.skeleton = function (dim) {
    var skeleton = this.clone()
      , topology = skeleton.topology
      , out = topology.length - dim
      ;

    while (--out) topology.pop();

    return skeleton;
  };

  /**
   * boundary
   * 
   * @param {Number} dim
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.getFacets = function (dim) {
    return this.topology[dim];
  };

  simplexn.SimplicialComplex.prototype.getFacet = function (dim, index) {
    return this.topology[dim].subarray(dim*index, dim*index + dim);
  };

  simplexn.SimplicialComplex.prototype.removeFacet = function (dim, index) {
    var topology = this.topology
      , facets
      , i
      ;

    for (i = 1; i < dim; i += 1) {
      facets = topology[i];
      topology[i] = new Uint32Array(facets.length - dim);
      topology[i].set(
        facets.subarray(index*dim, index*dim + dim),
        facets.subarray(index*dim + dim));
    }
  };

  simplexn.SimplicialComplex.prototype.boundary = function (dim) {
    var boundary = this.skeleton()
      , topology = boundary.topology
      , facet_i
      , facet_j
      , i
      , j
      , d
      , k_i
      , k_j
      , diff = false;
      ;

    for (i = 0; i < topology[dim].length; i += diff ? 0 : dim) {
      facet_i = topology[dim].subarray(i, i + dim);
      for (j = i + dim; j < facets.length; j += dim) {
        facet_j = topology[dim].subarray(j, j + dim);
        
        diff = false;
        for (k_i = 0; k_i < dim && !diff; k_i += 1) {
          for (k_j = 0; k_j < dim && !diff; k_j += 1) {
            diff = diff || facet_i[k_i] !== facet_j[k_j];
          }
        }
        
        if (!diff) {
          for (d = dim; d > 1; d -= 1) {
            topology[d] = topology[d].subarray(dim);
          }
          continue;
        }
      }
    }

    return boundary;
  };

}(this));