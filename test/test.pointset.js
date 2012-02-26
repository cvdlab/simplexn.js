!(function () {

  var _flat = simplexn._utils._flat;
  var _areEqual = simplexn._utils._areEqual;

  describe('PointSet', function () {
  
    describe('#equals(pointSet)', function () {
      
      it('is equal to a point set with the same points', function () {
        var points = [[1,2,3],[4.1,4.2,4.3],[0.0,Math.PI,-9]];
        var pointSet1 = new simplexn.PointSet(points);
        var pointSet2 = new simplexn.PointSet(points);

        expect(pointSet1.equals(pointSet2)).ok();
      });

      it('is not equal to a point set with a permutation of the same points', function () {
        var points1 = [[1,2,3],[4.1,4.2,4.3],[0.0,Math.PI,-9]];
        var points2 = [[4.1,4.2,4.3],[0.0,Math.PI,-9],[1,2,3]];
        var pointSet1 = new simplexn.PointSet(points1);
        var pointSet2 = new simplexn.PointSet(points2);

        expect(pointSet1.equals(pointSet2)).not.ok();
      });

      it('is not equal to a point set with a different dim', function () {
        var points1 = [[1,2,3],[4.1,4.2,4.3],[0.0,Math.PI,-9]];
        var points2 = [[1,2],[4.1,4.2],[0.0,Math.PI]];
        var pointSet1 = new simplexn.PointSet(points1);
        var pointSet2 = new simplexn.PointSet(points2);

        expect(pointSet1.equals(pointSet2)).not.ok();
      });

      it('is not equal to a point set with a different length', function () {
        var points1 = [[1,2,3],[4.1,4.2,4.3],[0.0,Math.PI,-9]];
        var points2 = [[1,2,3],[4.1,4.2,4.3],[0.0,Math.PI,-9],[0,1,2]];
        var pointSet1 = new simplexn.PointSet(points1);
        var pointSet2 = new simplexn.PointSet(points2);

        expect(pointSet1.equals(pointSet2)).not.ok();
      });
    });

    describe('#map(iterator)', function () {

      it('maps pointset with a mapping function in the same dimension space', function () {
        var mapping = function (coords) {
          var x = coords[0];
          var y = coords[1];

          return [2*x, 3*y];
        };
        var points1 = [[1,2],[5,6],[8,9],[4.5,5.4]];
        var points2 = [[2,6],[10,18],[16,27],[9,16.2]];
        var pointset1 = new simplexn.PointSet(points1);
        var pointset2 = new simplexn.PointSet(points2);

        pointset1.map(mapping);

        expect(pointset1.equals(pointset2)).to.be.ok();
      });

      it('maps pointset with a mapping function in a lower dimension space', function () {
        var mapping = function (coords) {
          var x = coords[0];
          var y = coords[1];

          return [2*x];
        };
        var points1 = [[1,2],[5,6],[8,9],[4.5,5.4]];
        var points2 = [[2],[10],[16],[9]];
        var pointset1 = new simplexn.PointSet(points1);
        var pointset2 = new simplexn.PointSet(points2);

        pointset1.map(mapping);

        expect(pointset1.equals(pointset2)).to.be.ok();
      });

      it('maps pointset with a mapping function in a higher dimension space', function () {
        var mapping = function (coords) {
          var x = coords[0];
          var y = coords[1];

          return [2*x, 3*y, x+y];
        };
        var points1 = [[1,2],[5,6],[8,9],[4.5,5.4]];
        var points2 = [[2,6,3],[10,18,11],[16,27,17],[9,16.2,9.9]];
        var pointset1 = new simplexn.PointSet(points1);
        var pointset2 = new simplexn.PointSet(points2);

        pointset1.map(mapping);

        expect(pointset1.equals(pointset2)).to.be.ok();
      });

    });

    describe('#merge(precision)', function () {

      it('does not change a pointset with nothig to merge', function () {
        var points = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]];
        var expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]];
        var expectedPointset = new simplexn.PointSet(expectedPoints);
        var expectedIndicesArray = [0,1,2,3,4,5,6,7,8];
        var expectedIndices = new Uint32Array(expectedIndicesArray);
        var pointset = new simplexn.PointSet(points, 3);
        var indices = pointset.merge(1e-2);

        expect(_areEqual(indices, expectedIndices)).to.be.ok();
        expect(pointset.equals(expectedPointset)).to.be.ok();
      });

      it('filters simple duplicate', function () {
        var points = [[.2,0,0],[0,.2,0],[.2,0,0],[.2,0,0],[.2,0,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23],[.21,0,0]];
        var expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.26,0],[0,0,.19],[.2,.2,.21],[.2,.2,.23]];
        var expectedPointset = new simplexn.PointSet(expectedPoints);
        var expectedIndicesArray = [0,1,0,0,0,2,3,4,5,6,7,8,4];
        var expectedIndices = new Uint32Array(expectedIndicesArray);
        var pointset = new simplexn.PointSet(points, 3);
        var indices = pointset.merge(1e-2);

        expect(_areEqual(indices, expectedIndices)).to.be.ok();
        expect(pointset.equals(expectedPointset)).to.be.ok();
      });

      it('fixes precision for all point in a pointset', function () {
        var points = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.2222,.2,.21],[.2,.2,.23]];
        var expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.22,.2,.21],[.2,.2,.23]];
        var expectedPointset = new simplexn.PointSet(expectedPoints);
        var expectedIndicesArray = [0,1,2,3,4,5,6,7,8];
        var expectedIndices = new Uint32Array(expectedIndicesArray);
        var pointset = new simplexn.PointSet(points, 3);
        var indices = pointset.merge(1e-2);

        expect(_areEqual(indices, expectedIndices)).to.be.ok();
        expect(pointset.equals(expectedPointset)).to.be.ok();
      });

      it('fixes precision and merge duplicates for all point in a pointset', function () {
        var points = [[.2,0,0],[0,.2,0],[.2,0,0],[.2,0,0],[.2,0,0],[0,0,.2],[.2,.2,.2],[.21,0,0],[0,.24,0],[0,0,.19],[.2222,.2,.21],[.2,.2,.23],[.21,0,0]];
        var expectedPoints = [[.2,0,0],[0,.2,0],[0,0,.2],[.2,.2,.2]];
        var expectedPointset = new simplexn.PointSet(expectedPoints);
        var expectedIndicesArray = [0,1,0,0,0,2,3,0,1,2,3,3,0];
        var expectedIndices = new Uint32Array(expectedIndicesArray);
        var pointset = new simplexn.PointSet(points, 3);
        var indices = pointset.merge(1e-1);

        expect(_areEqual(indices, expectedIndices)).to.be.ok();
        expect(pointset.equals(expectedPointset)).to.be.ok();
      });

    });

    describe('#filter(iterator)', function () {

      it('correctly filters a pointset', function () {
        var points = [[1.01,1.01,5.0,0],[1.01,2.01,-5.0,0],[1.01,-1.01,2.0,0],[-1.01,1.01,0.01,-0.60],[1.01,0,0.0,0],[6.01,1.01,-1.0,0]];
        var expectedPoints = [[1.01,1.01,5.0,0],[1.01,-1.01,2.0,0],[-1.01,1.01,0.01,-0.60],[1.01,0,0.0,0]];
        var expectedPointset = new simplexn.PointSet(expectedPoints);
        var pointset = new simplexn.PointSet(points, 4);
        var clonedPointset = new simplexn.PointSet(points, 4);
        var filteredPointset;


        filteredPointset = pointset.filter(function (point) {
          return point[2] >= 0;
        });

        expect(filteredPointset.equals(expectedPointset)).to.be.ok();
        expect(pointset.equals(clonedPointset)).to.be.ok();
      });

    });

    describe('#embed(pointSet)', function () {

      it('embeds the point set in a lower dimensional space', function () {
        var points1 = [[1, 2, 3], [4.1, 4.2, 4.3], [-7, Math.PI, 0.0]];
        var points2 = [[1, 2], [4.1, 4.2], [-7, Math.PI]];
        var pointSet1 = new simplexn.PointSet(points1);
        var pointSet2 = new simplexn.PointSet(points2);

        expect(pointSet1.embed(2).equals(pointSet2)).ok();
      });

      it('embeds the point set in a higher dimensional space', function () {
        var points1 = [[1, 2], [4.1, 4.2], [-7, Math.PI]]
        var points2 = [[1, 2, 0], [4.1, 4.2, 0], [-7, Math.PI, 0]];
        var pointSet1 = new simplexn.PointSet(points1);
        var pointSet2 = new simplexn.PointSet(points2);

        expect(pointSet1.embed(3).equals(pointSet2)).ok();
      });
    });

    describe('#map(iterator)', function () {

      it('correctly maps a pointset', function () {
        var points = [[1.01,1.01,5.0,0],[1.01,2.01,-5.0,0],[1.01,-1.01,2.0,0],[-1.01,1.01,0.01,-0.60],[1.01,0,0.0,0],[6.01,1.01,-1.0,0]];
        var expectedPoints = [[2.02,1.01,5.0,0],[2.02,2.01,-5.0,0],[2.02,-1.01,2.0,0],[-2.02,1.01,0.01,-0.60],[2.02,0,0.0,0],[12.02,1.01,-1.0,0]];
        var expectedPointset = new simplexn.PointSet(expectedPoints);
        var pointset = new simplexn.PointSet(points, 4);

        pointset.map(function (point) {
          point[0] = 2 * point[0];
          return point;
        });

        expect(pointset.equals(expectedPointset)).to.be.ok();
      });

    });
  });

}(this));
