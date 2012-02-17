(function () {

  var areEqual = function (ba1, ba2) {
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
          , expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]]
          , expectedPointset = new simplexn.PointSet(expectedPoints)
          , expectedIndicesArray = [0,1,2,3,4,5,6,7,8]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , pointset = new simplexn.PointSet(points, 3)
          , indices = pointset.merge(1e-2)
          , vertices = pointset.vertices
          ;

        expect(indices).to.be.a(Uint32Array);
        expect(areEqual(indices, expectedIndices)).to.be.ok();
        expected(pointset.equals(expectedPointset)).to.be.ok();
      });

      it('filter simple duplicate', function () {
        var points = [[.2,0,0],[0,.2,0],[.2,0,0],[.2,0,0],[.2,0,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23],[.21,0,0]]
          , expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]]
          , expectedPointset = new simplexn.PointSet(expectedPoints)
          , expectedIndicesArray = [0,1,0,0,0,2,3,4,5,6,7,8,4]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , pointset = new simplexn.PointSet(points, 3)
          , indices = pointset.merge(1e-2)
          , vertices = pointset.vertices
          ;

        expect(indices).to.be.a(Uint32Array);
        expect(areEqual(indices, expectedIndices)).to.be.ok();
        expected(pointset.equals(expectedPointset)).to.be.ok();
      });

      it('fix precision for all point in a pointset', function () {
        var points = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.2222,.2,.21],[.2,.2,.23]]
          , expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.22,.2,.21],[.2,.2,.23]]
          , expectedPointset = new simplexn.PointSet(expectedPoints)
          , expectedIndicesArray = [0,1,2,3,4,5,6,7,8]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , pointset = new simplexn.PointSet(points, 3)
          , indices = pointset.merge(1e-2)
          , vertices = pointset.vertices
          ;

        expect(indices).to.be.a(Uint32Array);
        expect(areEqual(indices, expectedIndices)).to.be.ok();
        expected(pointset.equals(expectedPointset)).to.be.ok();
      });

      it('fix precision and merge duplicates for all point in a pointset', function () {
        var points = [[.2,0,0],[0,.2,0],[.2,0,0],[.2,0,0],[.2,0,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.2222,.2,.21],[.2,.2,.23],[.21,0,0]]
          , expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2]]
          , expectedPointset = new simplexn.PointSet(expectedPoints)
          , expectedIndicesArray = [0,1,0,0,0,2,3,0,1,2,3,3,0]
          , expectedIndices = new Uint32Array(expectedIndicesArray)
          , pointset = new simplexn.PointSet(points, 3)
          , indices = pointset.merge(1e-1)
          , vertices = pointset.vertices
          ;

        expect(indices).to.be.a(Uint32Array);
        expect(areEqual(indices, expectedIndices)).to.be.ok();
        expected(pointset.equals(expectedPointset)).to.be.ok();
      });
    })
  });

  describe('#filter(iterator)', function () {
    it('correctly filter a pointset', function () {
      var points = [[1.01,1.01,5.0,0],[1.01,2.01,-5.0,0],[1.01,-1.01,2.0,0],[-1.01,1.01,0.01,-0.60],[1.01,0,0.0,0],[6.01,1.01,-1.0,0]]
        , expectedPoints = [[1.01,1.01,5.0,0],[1.01,-1.01,2.0,0],[-1.01,1.01,0.01,-0.60],[1.01,0,0.0,0]]
        , expectedPointset = new simplexn.PointSet(expectedPoints)
        , pointset = new simplexn.PointSet(points, 3)
        , clonedPointset = new simplexn.PointSet(points, 3)
        , fileteredPointeset = pointset.filter(function (point) {
            return point[2] >= 0;
          })
        ;

      expect(filteredPointset.equals(expectedPointset)).to.be.ok();
      expected(pointset.equals(clonedPointset)).to.be.ok();
    });
  });

}).call(this);