!(function () {

  describe('Geometries', function () {

    describe('simplexGrid(hlist)', function () {
      
      it('correctly instantiates a simplex grid - only positive quotes', function () {
        var quotesList = [[1,2],[3,4]];
        var expectedPoints = [[1,0],[3,0],[1,3],[3,3],[1,7],[3,7]];
        var expectedComplex = [[0,1,2],[3,2,1],[2,3,4],[5,4,3]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - positive and negative quotes', function () {
        var quotesList = [[1,2],[3,-1,4]];
        var expectedPoints = [[1,0],[3,0],[1,3],[3,3],[1,4],[3,4],[1,8],[3,8]];
        var expectedComplex = [[0,1,2],[3,2,1],[4,5,6],[7,6,5]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - only one level of quotes', function () {
        var quotesList = [[1,2,3]];
        var expectedPoints = [[1],[3],[6]];
        var expectedComplex = [[0,1],[1,2]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - one level of quotes, negative quotes', function () {
        var quotesList = [[1,2,-1,1,2]];
        var expectedPoints = [[1],[3],[4],[5],[7]];
        var expectedComplex = [[0,1],[2,3],[3,4]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - two level of quotes, negative quotes', function () {
        var quotesList = [[1,1,-1,1],[2,-2,2]];
        var expectedPoints = [[1,0],[2,0],[3,0],[4,0],[1,2],[2,2],[3,2],[4,2],[1,4],[2,4],[3,4],[4,4],[1,6],[2,6],[3,6],[4,6]];
        var expectedComplex = [[0,1,4],[5,4,1],[2,3,6],[7,6,3],[8,9,12],[13,12,9],[10,11,14],[15,14,11]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

    });
  });

}(this));