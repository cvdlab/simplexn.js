
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
  var min = Math.min;
  var abs = Math.abs;


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
   * @param {Array|Number} points or number of point to initialize;
   * @rn {Number} [rn=points[0].length] points dimension;
   * @api public
   */

  simplexn.PointSet = function (points, rn) {
    points = points || [[]];
    if (typeof points === 'number') {
      this.rn = rn;
      points = points * rn;
    } else {
      this.rn  = points[0].length;
      points = simplexn._flat(points);
    }
    this.points = new Float32Array(points);
  };

  /**
   * size
   * 
   * @property
   * @api public
   */

  simplexn.PointSet.prototype.__defineGetter__('size', function () {
    return this.points.length / this.rn;
  });

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
   * @param {Array|Float32Array} points
   * @param {Number} [index=0]
   * @return {simplexn.PointSet} this for chaining
   * @api public
   */

  simplexn.PointSet.prototype.set = function (point, index) {
    point = point || 0;
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
    var length = points.length;
    var rn = this.rn;
    var i, j;

    for (i = j = 0; i < length; i += rn, j += 1) {
      iterator(points.subarray(i, i + rn), j);
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

    for (i = j = 0; i < length; i += rn, j += 1) {
      points.set(iterator(points.subarray(i, i + rn), j), i);
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
    var precision = precision || 1e-4;
    var points = this.points;
    var length = points.length;
    var rn = this.rn;
    var size = this.size;
    var indices = new Uint32Array(size);
    var merged = new Float32Array(length);
    var usedIndices = 0;
    var usedCoords = 0;
    var vertexAdded;
    var equals;
    var i, j, k;

    for (i = 0; i < length; i += rn) {
      vertexAdded = false;
      for (j = 0; j < usedCoords && !vertexAdded; j += rn) {
        equals = true;
        for (k = 0; k < rn; k += 1) {
          points[i+k] = round(points[i+k] / precision) * precision;
          equals &= points[i+k] === merged[j+k];
        }
        vertexAdded |= equals; 
      }
      indices[i/rn] = !vertexAdded ? usedIndices : j/rn-1;
      if (!vertexAdded) {
        for (k = 0; k < rn; k += 1) {
          merged[usedCoords+k] = points[i+k];
        }
        usedIndices += 1;
        usedCoords = usedIndices*rn;
      }
    }

    this.points = merged.subarray(0, usedCoords);

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
    var points = this.points;
    var length = points.length;
    var rn = this.rn;
    var cos_a = cos(angle);
    var sin_a = sin(angle);
    var r_ii = cos_a;
    var r_ij = -sin_a;
    var r_ji = sin_a;
    var r_jj = cos_a;
    var d_i = dims[0];
    var d_j = dims[1];
    var v_i;
    var v_j;
    var i, j, k;

    for (k = 0; k < length; k += rn, i = k + d_i, j = k + d_j) {
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
    var length = points.length;
    var rn = this.rn;
    var i, j;

    for (i = 0; i < length; i += rn) {
      for (j = 0; j < dims; j += 1) {
        points[i+dims[j]] *= values[j]; 
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
    var points = this.points 
    var length = points.length;
    var rn = this.rn;
    var i, j;

    for (i = 0; i < length; i += rn) {
      for (j = 0; j < dims; j += 1) {
        points[i+dims[j]] += values[j]; 
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
    var dim = dim || this.rn + 1
    var rn = this.rn;
    var minDim = Math.min(rn, dim);
    var oldPoints = this.points;
    var oldLength = oldPoints.length;
    var length = oldLength / rn * dim;
    var points = new Float32Array(length);
    var i, j, k;

    for (i = 0, j = 0; i < oldLength; i += rn, j += dim) {
      for (k = 0; k < minDim; k += 1) {
        points[j + k] = oldPoints[i + k];
      }
    }

    this.points = points;
    this.rn = dim;
    
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

    if (a1Len !== a2Len) {
      return false;
    }

    for (i = 0; i < a1Len; i++) {
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
 
    return true;
  };


  /**
   * Topology
   * 
   * @constructor
   * @param {Array|Uint32Array} complex
   * @param {Number} [dim=complex[0].length - 1]
   * @api public
   */

  simplexn.Topology = function (complex, dim) {
    var complex = complex || [[]];
    var dim;
    var complexes = new Array();
    var complexTemp, complexNext;
    var complexNextLength;
    var complexLength;
    var cellDim;
    var d, c, i, j, k;
    var exchange1, exchange2;

    complex = complex.length > 0 ? complex : [[]];
    dim = dim || complex[0].length - 1;
    complex = complex instanceof Array ? simplexn._flat(complex) : complex;
    if (dim >= 0) { complexes[0] = new Uint32Array(); }
    if (dim >= 1) { complexes[dim] = new Uint32Array(complex); }

    for (d = dim; d > 1; d -= 1) {
      complexNext = complexes[d];
      complexNextLength = complexNext.length;
      cellDim = d + 1;
      complexLength = complexNextLength / cellDim;
      complexTemp = new Uint32Array(cellDim * complexLength * d);
      complexes[d-1] = complexTemp;
      k = 0;
      for (c = 0; c < complexNextLength; c += cellDim) {
        for (i = 0; i < cellDim; i++) {
          for (j = 0; j < cellDim; j++) {
            if (i != j) {
              complexTemp[k] = complexNext[c+j];
              k++;
            }
          }
          if (i & 1) { // is odd
            exchange1 = k - cellDim + 1;
            exchange2 = k - 1;
            complexTemp[exchange1] ^= complexTemp[exchange2];
            complexTemp[exchange2] ^= complexTemp[exchange1];
            complexTemp[exchange1] ^= complexTemp[exchange2];
          }
        }
      }
    }

    this.complexes = complexes;
  };

  /**
   * dim
   * 
   * @property
   * @api public
   */

  simplexn.Topology.prototype.__defineGetter__('dim', function () {
    return this.complexes.length - 1;
  });

  /**
   * equals 
   * 
   * @param {simplexn.Topology} topology
   * @return {Boolean} true if this is equals to the given topology, false otherwise.
   * @api public
   */

  simplexn.Topology.prototype.equals = function (other) {
    var complexes1 = this.complexes;
    var complexes2 = other.complexes;
    var dim1 = this.dim;
    var dim2 = other.dim;
    var i;

    if (dim1 !== dim2) return false;
    for (i = 0; i < dim1; i += 1) {
      if (!simplexn._areEqual(complexes1[i], complexes2[i])) return false;
    }
    return true;
  };

  /**
   * clone
   * 
   * @return {simplexn.Topology} cloned topology
   * @api public
   */

  simplexn.Topology.prototype.clone = function () {
    var topology = new simplexn.Topology();
    var dim = this.dim;
    var complexes = new Array();
    var i;

    this.complexes.forEach(function (complex, i) {
      complexes[i] = new Uint32Array(complexe);
    });

    topology.complexes = complexes;
    return topology;
  };

  /**
   * SimplicialComplex
   * 
   * @constructor
   * @param {Array|Float32Array} points
   * @faces {Array|Uint32Array} complex
   * @api public
   */

  simplexn.SimplicialComplex = function (points, complex) {
    var points = points || [[]];
    var complex = complex || [[]];

    this.pointset = new simplexn.PointSet(points);
    this.topology = new simplexn.Topology(complex);
  };

/**
   * rn
   * 
   * @property
   * @api public
   */

  simplexn.SimplicialComplex.prototype.__defineGetter__('rn', function () {
    return this.pointset.rn;
  });

/**
   * dim
   * 
   * @property
   * @api public
   */

  simplexn.SimplicialComplex.prototype.__defineGetter__('dim', function () {
    return this.topology.dim;
  });

  /**
   * rotate
   * 
   * @param {Array|Uint32Array} dims
   * @param {Number} angle
   * @return {simplexn.SimplicialComplex} this for chaining
   * @api public
   */

  simplexn.SimplicialComplex.prototype.rotate = function (dims, angle) {
    this.pointset.rotate(dims, angle);
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
    this.pointset.scale(dims, values);
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
    this.pointset.translate(dims, values);
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
    this.pointset.transform(matrix);
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
    this.pointset.embed(dim);
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
    simplicialcomplex.pointset = this.pointset.clone();
    simplicialcomplex.topology = this.topology.clone();
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
    var pointset1 = this.pointset;
    var pointset2 = simpcomp.pointset;
    var topology1 = this.topology;
    var topology2 = simpcomp.topology;

    if (! pointset1.equals(pointset2)) return false;
    if (! topology1.equals(topology2)) return false;

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
    var hlist = hlist || [1];
    var hlistLength = hlist.length;
    var hlist0 = hlist[0];
    var hlist0isNegative = hlist0 < 0;
    var positiveQuotes = hlist.filter(function (h) {return h >= 0}).length;
    
    var oldRn = this.rn;
    var newRn = oldRn + 1;
    var pointset = this.pointset;
    var pointsetSize = pointset.size;
    var oldEmbeddedPoints;
    var oldPointsLength = pointsetSize * oldRn;
    var newPointsLength = pointsetSize * newRn;
    var newPoints = new Float32Array(newPointsLength);

    var newPointsetSize = (hlistLength + 1 - (hlist0isNegative)) * pointsetSize;
    var newPointset = new simplexn.PointSet(newPointsetSize, newRn);

    var oldDim = this.dim;
    var newDim = oldDim + 1; 
    var topology = this.topology;
    var cellLength = oldDim + 1;
    var complex = topology.complexes[oldDim];
    var complexLength = complex.length;
    var complexSize = complexLength / cellLength;

    var newCellLength = newDim + 1;
    var newComplexLength = positiveQuotes * complexSize * newDim * newCellLength;
    var newComplex = new Uint32Array(newComplexLength);

    var tempLength = 2 * cellLength;
    var temp = new Uint32Array(tempLength);
    var tempIndx;
    var cIndx = 0 ;
    var exchange1, exchange2;
    var end;
    var quote = 0;
    var h, v, c, i, j;

    this.embed();
    oldEmbeddedPoints = this.pointset.points;
    newPoints.set(oldEmbeddedPoints);
    if (!hlist0isNegative) newPointset.set(oldEmbeddedPoints);

    for (h = 0; h < hlistLength; h += 1) {
      quote += abs(hlist[h]);

      // add new points
      for (v = newRn - 1; v < newPointsLength; v += newRn) {
        newPoints[v] = quote;
      }
      newPointset.set(newPoints, (h + 1 - (hlist0isNegative)) * pointsetSize);

      // create new cells
      if (hlist[h] >= 0) {
        for (c = 0; c < complexSize; c += 1) {
          // fill temp with selected indexes
          for (i = 0; i < cellLength; i++) {
            tempIndx = complex[c*cellLength+i] + (h - (hlist0isNegative)) * pointsetSize;
            temp[i] = tempIndx;
            temp[i+cellLength] = tempIndx + pointsetSize;
          }
          
          // pick cells from temp, cellLength by cellLength
          for (i = 0; i < cellLength; i += 1) {
            end = i + cellLength + 1;
            for (j = i; j < end; j++) {
              newComplex[cIndx++] = temp[j];
            }
            // take care of orientation
            if (((cellLength - 1) * i) & 1) {
              exchange1 = cIndx - 1;
              exchange2 = cIndx - (cellLength + 1);
              newComplex[exchange1] ^= newComplex[exchange2];
              newComplex[exchange2] ^= newComplex[exchange1];
              newComplex[exchange1] ^= newComplex[exchange2];
            }
          }
        }
      }
    }

    this.pointset = newPointset;
    this.topology = new simplexn.Topology(newComplex, newDim);
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

  simplexn.SimplicialComplex.prototype.getFacet = function (dim, index) {
    var topology = this.topology;
    var pointset = this.vertices;
    var facets = this.topology[dim];
    var facet = facets.subarray(dim*index, dim*index + dim);
    var vertices = new Array(dim);

    for (var i = 0; i < dim; i += 1) {
      vertices[i] = pointset.get(facet[i]);
    }

    return vertices;
  };

  simplexn.SimplicialComplex.prototype.explode = function (dims, values) {
    var exploded = this.clone().scale(dims, values);
    var dim = this.topology.length - 1;
    var cells = this.topology[dim];
    var exploded_cells = exploded.topology[dim];

    for (var i = 0; i < cells.length; i += dim) {
      // TODO: waiting for refactoring...
    }

    return this;
  };

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

  /**
   * geometries
   */
  simplexn.geometries = {};

  /**
   * simplexGrid
   * 
   * @param {Array} quotesList is a list of hlist which must be made by positive numbers or by an alternation of positive and negative numbers
   * @return {simplexn.SimplicialComplex} a grid of simplexes
   * @api public
   */

  simplexn.geometries.simplexGrid = function (quotesList) {
    var quotesList = quotesList ? quotesList.slice(0) : [[]];
    var quotesListHead = quotesList.shift();
    var quotesListHead0 = quotesListHead[0];
    var quotesListHead0isNeg = quotesListHead0 <= 0;
    var points = quotesListHead0isNeg ? [] : [[0]];
    var complex = [];
    var simpcomp;
    var quote = 0;
    var indx;

    quotesListHead.forEach(function (height, i) {
      quote += abs(height);
      points.push([quote]);
      if (height > 0) {
        indx = i - (quotesListHead0isNeg);
        complex.push([indx,indx+1]);
      }
    });

    simpcomp = new simplexn.SimplicialComplex(points, complex);

    quotesList.forEach(function (quotes) {
      simpcomp.extrude(quotes);
    });
  
    return simpcomp;
  };

}(this));