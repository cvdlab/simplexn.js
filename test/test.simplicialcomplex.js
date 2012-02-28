!(function () {

  var _flat = simplexn._utils._flat;
  var _areEqual = simplexn._utils._areEqual;

  describe('SimplicialComplex', function () {

    describe('#equals(simpcomp)', function () {

      it('states that 2 simplicial complex made by the same points and cells are equal', function () {
        var points = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var complex = [[0,1,2,3,4]];
        var simpcomp1 = new simplexn.SimplicialComplex(points, complex);
        var simpcomp2 = new simplexn.SimplicialComplex(points, complex);

        expect(simpcomp1.equals(simpcomp2)).to.be.ok();
      });

      it('states that 2 simplicial complex made by different points and same cells are not equal', function () {
        var points1 = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var points2 = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0.4,0,2]];
        var cells = [[0,1,2,3,4]];
        var simpcomp1 = new simplexn.SimplicialComplex(points1, cells);
        var simpcomp2 = new simplexn.SimplicialComplex(points2, cells);
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });

      it('states that 2 simplicial complex made by same points and different cells are not equal', function () {
        var points = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var cells1 = [[0,1,2,3,4]];
        var cells2 = [[0,1,4,3,2]];
        var simpcomp1 = new simplexn.SimplicialComplex(points, cells1);
        var simpcomp2 = new simplexn.SimplicialComplex(points, cells2);
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });

      it('states that 2 simplicial complex made by same points and cells of different dimension are not equal', function () {
        var points = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var cells1 = [[0,1,2,3,4]];
        var cells2 = [[1,2,3,4],[4,2,3,0],[0,1,3,4],[4,1,2,0],[0,1,2,3]];
        var simpcomp1 = new simplexn.SimplicialComplex(points, cells1);
        var simpcomp2 = new simplexn.SimplicialComplex(points, cells2);
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });
    });

    describe('#merge(precision)', function () {
      it('merges a simplecial complex', function () {
        var points = [[0,0],[0.007,0],[0,1],[0.007,1],[0,1.003],[0.007,1.003],[0,2.003],[0.007,2.003]];
        var complexes = [[0,1,2],[3,2,1],[4,5,6],[7,6,5]]
        var expectedPoints = [[0,0],[0.01,0],[0,1],[0.01,1],[0,2],[0.01,2]];
        var expectedComplexes = [[0,1,2],[3,2,1],[2,3,4],[5,4,3]];
        var simpcomp = new simplexn.SimplicialComplex(points, complexes);
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplexes);

        simpcomp.merge(1e-2);


        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });
    });

    describe('#extrude(hlist)', function () {

      it('extrudes 1D simplexes with positive quotes', function () {
        var points = [[0],[1],[3],[4]];
        var cells1d = [[0,1],[1,2],[2,3]];
        var hlist = [1,1];
        var expectedPoints = [[0,0],[1,0],[3,0],[4,0],[0,1],[1,1],[3,1],[4,1],[0,2],[1,2],[3,2],[4,2]];
        var expectedCells2d = [[0,1,4],[1,5,4,],[1,2,5],[2,6,5],[2,3,6],[3,7,6],[4,5,8],[5,9,8],[5,6,9],[6,10,9],[6,7,10],[7,11,10]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedCells2d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells1d);

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });

      it('extrudes 1D simplexes embedded in 2D space with positive quotes', function () {
        var points = [[0,7],[1,7],[3,7],[4,7]];
        var cells1d = [[0,1],[1,2],[2,3]];
        var hlist = [1,1];
        var expectedPoints = [[0,7,0],[1,7,0],[3,7,0],[4,7,0],[0,7,1],[1,7,1],[3,7,1],[4,7,1],[0,7,2],[1,7,2],[3,7,2],[4,7,2]];
        var expectedCells2d = [[0,1,4],[1,5,4],[1,2,5],[2,6,5],[2,3,6],[3,7,6],[4,5,8],[5,9,8],[5,6,9],[6,10,9],[6,7,10],[7,11,10]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedCells2d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells1d);

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });

      it('extrudes 2D simplex with positive quotes', function () {
        var points = [[0,0],[1,0],[0,1]];
        var cells2d = [[0,1,2]];
        var hlist = [1,1];
        var expectedPoints = [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,0,1],[0,1,1],[0,0,2],[1,0,2],[0,1,2]];
        var expectedCells3d = [[0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedCells3d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells2d);

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });

      it('extrudes 2D simplexes with positive quotes', function () {
        var points = [[0,0],[1,0],[0,1],[1,1]];
        var cells2d = [[0,1,2],[2,1,3]];
        var hlist = [1,1];
        var expectedPoints = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1],[0,0,2],[1,0,2],[0,1,2],[1,1,2]];
        var expectedCells3d = [[0,1,2,4],[1,2,4,5],[2,4,5,6],
                               [1,2,5,3],[2,3,6,5],[3,5,7,6],
                               [4,5,6,8],[5,6,8,9],[6,8,9,10],
                               [5,6,9,7],[6,7,10,9],[7,9,11,10]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedCells3d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells2d);
          ;

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });

      it('extrudes 1D simplexes with positive and negative quotes', function () {
        var points = [[0],[1],[3]];
        var cells1d = [[0,1],[1,2]];
        var hlist = [1,-2,1];
        var expectedPoints = [[0,0],[1,0],[3,0],
                                [0,1],[1,1],[3,1],
                                [0,3],[1,3],[3,3],
                                [0,4],[1,4],[3,4]];
        var expectedCells2d = [[0,1,3],[1,4,3],[1,2,4],[2,5,4],[6,7,9],[7,10,9],[7,8,10],[8,11,10]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints,expectedCells2d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells1d);
          ;

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });

      it('extrudes 2D simplexes with positive and negative quotes', function () {
        var points = [[0,0],[1,0],[0,1],[1,1]]
        var cells2d = [[0,1,2],[2,1,3]];
        var hlist = [1,-2,1];
        var expectedPoints = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],
                                [0,0,1],[1,0,1],[0,1,1],[1,1,1],
                                [0,0,3],[1,0,3],[0,1,3],[1,1,3],
                                [0,0,4],[1,0,4],[0,1,4],[1,1,4]];
        var expectedCells3d = [[0,1,2,4],[1,2,4,5],[2,4,5,6],
                               [1,2,5,3],[2,3,6,5],[3,5,7,6],
                               [8,9,10,12],[9,10,12,13],[10,12,13,14],
                               [9,10,13,11],[10,11,14,13],[11,13,15,14]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints,expectedCells3d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells2d);

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });

      it('extrudes 2D simplexes - quotes begin with a negative values', function () {
        var points = [[0],[1],[2]]
        var cells2d = [[0,1],[1,2]];
        var hlist = [-2,1,1];
        var expectedPoints = [[0,2],[1,2],[2,2],[0,3],[1,3],[2,3],[0,4,],[1,4],[2,4]];
        var expectedCells3d = [[0,1,3],[1,4,3],[1,2,4],[2,5,4],[3,4,6],[4,7,6],[4,5,7],[5,8,7]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints,expectedCells3d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells2d);

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });
    });

  });

}(this));
