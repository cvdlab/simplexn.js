!(function () {

  describe('Geometries', function () {

    describe('simplexGrid(hlist)', function () {
      
      it('correctly instantiates a simplex grid - only positive quotes', function () {
        var quotesList = [[1,2],[3,4]];
        var expectedPoints = [[0,0],[1,0],[3,0],[0,3],[1,3],[3,3],[0,7],[1,7],[3,7]];
        var expectedComplex = [[0,1,3],[1,4,3],[1,2,4],[2,5,4],[3,4,6],[4,7,6],[4,5,7],[5,8,7]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - positive and negative quotes', function () {
        var quotesList = [[1],[3,-1,4]];
        var expectedPoints = [[0,0],[1,0],[0,3],[1,3],[0,4],[1,4],[0,8],[1,8]];
        var expectedComplex = [[0,1,2],[1,3,2],[4,5,6],[5,7,6]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - only one level of quotes', function () {
        var quotesList = [[1,2,3]];
        var expectedPoints = [[0],[1],[3],[6]];
        var expectedComplex = [[0,1],[1,2],[2,3]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - one level of quotes, negative quotes', function () {
        var quotesList = [[1,2,-1,1,2]];
        var expectedPoints = [[0],[1],[3],[4],[5],[7]];
        var expectedComplex = [[0,1],[1,2],[3,4],[4,5]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - two level of quotes, negative quotes', function () {
        var quotesList = [[1,-1,1],[2,-2,2]];
        var expectedPoints = [[0,0],[1,0],[2,0],[3,0],[0,2],[1,2],[2,2],[3,2],[0,4],[1,4],[2,4],[3,4],[0,6],[1,6],[2,6],[3,6]];
        var expectedComplex = [[0,1,4],[1,5,4],[2,3,6],[3,7,6],[8,9,12],[9,13,12],[10,11,14],[11,15,14]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - one level of quotes, starting with a negative quote', function () {
        var quotesList = [[-2,1,-1,2]];
        var expectedPoints = [[2],[3],[4],[6]];
        var expectedComplex = [[0,1],[2,3]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });

      it('correctly instantiates a simplex grid - two level of quotes, starting with a negative quote', function () {
        var quotesList = [[-2,1,-1,2], [-3,1,-1,3]];
        var expectedPoints = [[2,3],[3,3],[4,3],[6,3],[2,4],[3,4],[4,4],[6,4],[2,5],[3,5],[4,5],[6,5],[2,8],[3,8],[4,8],[6,8]];
        var expectedComplex = [[0,1,4],[1,5,4],[2,3,6],[3,7,6],[8,9,12],[9,13,12],[10,11,14],[11,15,14]];
        var simplexgrid = simplexn.geometries.simplexGrid(quotesList);
        var simpcomp = new simplexn.SimplicialComplex(expectedPoints, expectedComplex);

        expect(simplexgrid.equals(simpcomp)).to.be.ok();
      });
    });

    describe('cuboid(sides)', function () {
      it('correctly instantiates a cuboidal simplicial complex', function () {
        var cuboid = simplexn.geometries.cuboid([3,2,1]);
        var points = [[0,0,0],[3,0,0],[0,2,0],[3,2,0],[0,0,1],[3,0,1],[0,2,1],[3,2,1]];
        var cells = [[0,1,2,4],[1,2,4,5],[2,4,5,6],[1,2,5,3],[2,3,6,5],[3,5,7,6]];
        var simpcomp = new simplexn.SimplicialComplex(points,cells);

        expect(cuboid.equals(simpcomp)).to.be.ok();
      });
    });

    describe('cube(d)', function () {
      it('correctly instantiates a 3D cube', function () {
        var cube = simplexn.geometries.cube(3);
        var points = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
        var cells = [[0,1,2,4],[1,2,4,5],[2,4,5,6],[1,2,5,3],[2,3,6,5],[3,5,7,6]];
        var simpcomp = new simplexn.SimplicialComplex(points,cells);

        expect(cube.equals(simpcomp)).to.be.ok();
      });
    });

    describe('circle(radius, n)', function () {
      it('correctly instantiates a circle made by 4 segments', function () {
        var circle = simplexn.geometries.circle(2,4);
        var points =[[0,2],[2,0],[0,-2],[-2,0]];
        var cells = [[0,1],[1,2],[2,3],[3,1]];
        var simpcomp = new simplexn.SimplicialComplex(points,cells);

        expect(circle.equals(simpcomp)).to.be.ok();
      });
    });
  });

}(this));