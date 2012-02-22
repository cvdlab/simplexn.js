!(function () {

  describe('SimplicialComplex', function () {

    describe('#equals(simpcomp)', function () {

      it('states that 2 simplicial complex made by the same vertices and faces are equal', function () {
        var points = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var complex = [[0,1,2,3,4]];
        var simpcomp1 = new simplexn.SimplicialComplex(points, complex);
        var simpcomp2 = new simplexn.SimplicialComplex(points, complex);

        expect(simpcomp1.equals(simpcomp2)).to.be.ok();
      });

      it('states that 2 simplicial complex made by different vertices and same faces are not equal', function () {
        var vertices1 = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var vertices2 = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0.4,0,2]];
        var faces = [[0,1,2,3,4]];
        var simpcomp1 = new simplexn.SimplicialComplex(vertices1, faces);
        var simpcomp2 = new simplexn.SimplicialComplex(vertices2, faces);
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });

      it('states that 2 simplicial complex made by same vertices and different faces are not equal', function () {
        var vertices = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var faces1 = [[0,1,2,3,4]];
        var faces2 = [[0,1,4,3,2]];
        var simpcomp1 = new simplexn.SimplicialComplex(vertices, faces1);
        var simpcomp2 = new simplexn.SimplicialComplex(vertices, faces2);
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });

      it('states that 2 simplicial complex made by same vertices and faces of different dimension are not equal', function () {
        var vertices = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]];
        var faces1 = [[0,1,2,3,4]];
        var faces2 = [[1,2,3,4],[4,2,3,0],[0,1,3,4],[4,1,2,0],[0,1,2,3]];
        var simpcomp1 = new simplexn.SimplicialComplex(vertices, faces1);
        var simpcomp2 = new simplexn.SimplicialComplex(vertices, faces2);
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });
    });

    describe('#extrude(hlist)', function () {

      it('extrudes 1D simplexes with positive quotes', function () {
        var points = [[0],[1],[3],[4]];
        var cells1d = [[0,1],[1,2],[2,3]];
        var hlist = [1,1];
        var expectedPoints = [[0,0],[1,0],[3,0],[4,0],[0,1],[1,1],[3,1],[4,1],[0,2],[1,2],[3,2],[4,2]];
        var expectedCells2d = [[0,1,4],[5,4,1],[1,2,5],[6,5,2],[2,3,6],[7,6,3],[4,5,8],[9,8,5],[5,6,9],[10,9,6],[6,7,10],[11,10,7]];
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
        var expectedCells2d = [[0,1,4],[5,4,1],[1,2,5],[6,5,2],[2,3,6],[7,6,3],[4,5,8],[9,8,5],[5,6,9],[10,9,6],[6,7,10],[11,10,7]];
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
                               [2,1,3,6],[1,3,6,5],[3,6,5,7],
                               [4,5,6,8],[5,6,8,9],[6,8,9,10],
                               [6,5,7,10],[5,7,10,9],[7,10,9,11]];
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
        var expectedCells2d = [[0,1,3],[4,3,1],[1,2,4],[5,4,2],[6,7,9],[10,9,7],[7,8,10],[11,10,8]];
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
                               [2,1,3,6],[1,3,6,5],[3,6,5,7],
                               [8,9,10,12],[9,10,12,13],[10,12,13,14],
                               [10,9,11,14],[9,11,14,13],[11,14,13,15]];
        var expectedSimpcomp = new simplexn.SimplicialComplex(expectedPoints,expectedCells3d);
        var simpcomp = new simplexn.SimplicialComplex(points, cells2d);
          ;

        simpcomp.extrude(hlist);

        expect(simpcomp.equals(expectedSimpcomp)).to.be.ok();
      });
    });

    describe('#skeleton(dim)', function () {

      it('if dim is 1, remove high order cells', function () {
        var vertex = [[0,0,0],[2,0,0],[0,2,0],[0,0,2], [2,2,2], [2,2,0]]
          , faces3d = [[0,1,2,3],[2,3,1,4],[2,1,5,4]]
          , faces2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0], [3,1,4],[4,1,2],[2,3,4],[1,3,2], [1,5,4],[4,5,2],[2,1,4],[5,1,2]]
          , faces1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1],
                       [1,4],[4,3],[3,1],[1,2],[2,4],[4,1],[3,4],[4,2],[2,3],[3,2],[2,1],[1,3],
                       [5,4],[4,1],[1,5],[5,2],[2,4],[4,5],[1,4],[4,2],[2,1],[1,2],[2,5],[5,1]
                      ]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(flat(faces1d)) // 1D
            , new Uint32Array(flat(faces2d)) // 2D
            ]
          , sc = new simplexn.SimplicialComplex(vertex, faces3d)
          , skeleton = sc.skeleton(2)
          ;

        expect(sc.topology).to.be.a(Array);
        expect(sc.topology[0]).to.be.a(Uint32Array);
        expect(sc.topology[1]).to.be.a(Uint32Array);
        expect(sc.topology[2]).to.be.a(Uint32Array);
        expect(areEqual(sc.topology[0], expectedFaces[0])).to.be.ok();      
        expect(areEqual(sc.topology[1], expectedFaces[1])).to.be.ok();
        expect(areEqual(sc.topology[2], expectedFaces[2])).to.be.ok();
        expect(areEqual(sc.topology[3], expectedFaces[3])).to.be.ok();

        expect(skeleton.topology).to.be.a(Array);
        expect(skeleton.topology[0]).to.be.a(Uint32Array);
        expect(skeleton.topology[1]).to.be.a(Uint32Array);
        expect(skeleton.topology[2]).to.be.a(Uint32Array);
        expect(areEqual(skeleton.topology[0], expectedFaces[0])).to.be.ok();      
        expect(areEqual(skeleton.topology[1], expectedFaces[1])).to.be.ok();
        expect(areEqual(skeleton.topology[2], expectedFaces[2])).to.be.ok();
        expect(areEqual(skeleton.topology[3] === undefined)).to.be.ok();
      });

    });

  });

}(this));
