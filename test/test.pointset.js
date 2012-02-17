(function () {

  var compareBufferArray = function (ba1, ba2) {
    var ba1Len = ba1.length
      , ba2Len = ba2.length
      , res = ba1Len === ba2Len
      , i
      ;

    if (res) {
      for (i = 0; i < ba1Len && res; i++) {
        res &= ba1[i] === ba2[i];
      }
    }
 
    return res;
  }

  describe('PointSet', function () {
    
    describe('#merge(precision)', function () {
      it('does not change a pointset with nothig to merge', function () {
        var points = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]]
          , expectedPointArray = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]]
          , expectedVertices = new Float32Array(simplexn._flat(expectedPointArray))
          , expectedIndicesArray = [0,1,2,3,4,5,6,7,8]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , ps = new simplexn.PointSet(points, 3)
          , indices = ps.merge(1e-2)
          , vertices = ps.vertices
          ;

        expect(vertices).to.be.a(Float32Array);
        expect(indices).to.be.a(Uint32Array);
        expect(compareBufferArray(indices, expectedIndices)).to.be.ok();
        expect(compareBufferArray(vertices, expectedVertices)).to.be.ok();
      });

      it('filter simple duplicate', function () {
        var points = [[.2,0,0],[0,.2,0],[.2,0,0],[.2,0,0],[.2,0,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23],[.21,0,0]]
          , expectedPointArray = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]]
          , expectedVertices = new Float32Array(simplexn._flat(expectedPointArray))
          , expectedIndicesArray = [0,1,0,0,0,2,3,4,5,6,7,8,4]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , ps = new simplexn.PointSet(points, 3)
          , indices = ps.merge(1e-2)
          , vertices = ps.vertices
          ;

        expect(vertices).to.be.a(Float32Array);
        expect(indices).to.be.a(Uint32Array);
        expect(compareBufferArray(indices, expectedIndices)).to.be.ok();
        expect(compareBufferArray(vertices, expectedVertices)).to.be.ok();
      });

      it('fix precision for all point in a pointset', function () {
        var points = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.2222,.2,.21],[.2,.2,.23]]
          , expectedPointArray = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.22,.2,.21],[.2,.2,.23]]
          , expectedVertices = new Float32Array(simplexn._flat(expectedPointArray))
          , expectedIndicesArray = [0,1,2,3,4,5,6,7,8]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , ps = new simplexn.PointSet(points, 3)
          , indices = ps.merge(1e-2)
          , vertices = ps.vertices
          ;

        expect(vertices).to.be.a(Float32Array);
        expect(indices).to.be.a(Uint32Array);
        expect(compareBufferArray(indices, expectedIndices)).to.be.ok();
        expect(compareBufferArray(vertices, expectedVertices)).to.be.ok();
      });

      it('fix precision and merge duplicates for all point in a pointset', function () {
        var points = [[.2,0,0],[0,.2,0],[.2,0,0],[.2,0,0],[.2,0,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.2222,.2,.21],[.2,.2,.23],[.21,0,0]]
          , expectedPointArray = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2]]
          , expectedVertices = new Float32Array(simplexn._flat(expectedPointArray))
          , expectedIndicesArray = [0,1,0,0,0,2,3,0,1,2,3,3,0]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , ps = new simplexn.PointSet(points, 3)
          , indices = ps.merge(1e-1)
          , vertices = ps.vertices
          ;

        expect(vertices).to.be.a(Float32Array);
        expect(indices).to.be.a(Uint32Array);
        expect(compareBufferArray(indices, expectedIndices)).to.be.ok();
        expect(compareBufferArray(vertices, expectedVertices)).to.be.ok();
      });
    })
  });

}).call(this);