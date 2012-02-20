!(function () {

  describe('SimplicialComplex', function () {

    describe('#_computeTopology()', function () {

      it('correctly computes topology of a simplicial complex made by one tetrahedron', function () {
        var vertices = [[0,0,0],[2,0,0],[0,2,0],[0,0,2]]
          , faces3d = [[0,1,2,3]]
          , faces2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0]]
          , faces1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1]]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(faces1d)) // 1D
            , new Uint32Array(simplexn._flat(faces2d)) // 2D
            , new Uint32Array(simplexn._flat(faces3d)) // 3D
            ]
          , sc = new simplexn.SimplicialComplex(vertices, faces3d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(simplexn._areEqual(topology[0], expectedFaces[0])).to.be.ok();
        expect(simplexn._areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(simplexn._areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(simplexn._areEqual(topology[3], expectedFaces[3])).to.be.ok();
      });

      it('correctly computes topology of a simplicial complex made by one tetrahedron whit unuseful points', function () {
        var vertices = [[0,0,0],[2,0,0],[5.6,6.7,3.4],[0,2,0],[0,0,2],[1.5,3.5,0]]
          , faces3d = [[0,1,3,4]]
          , faces2d = [[1,3,4],[4,3,0],[0,1,4],[3,1,0]]
          , faces1d = [[3,4],[4,1],[1,3],[3,0],[0,4],[4,3],[1,4],[4,0],[0,1],[1,0],[0,3],[3,1]]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(faces1d)) // 1D
            , new Uint32Array(simplexn._flat(faces2d)) // 2D
            , new Uint32Array(simplexn._flat(faces3d)) // 3D
            ]
          , sc = new simplexn.SimplicialComplex(vertices, faces3d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(simplexn._areEqual(topology[0], expectedFaces[0])).to.be.ok();
        expect(simplexn._areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(simplexn._areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(simplexn._areEqual(topology[3], expectedFaces[3])).to.be.ok();
      });

      it('correctly computes topology of a simplicial complex made by three tetrahedrons', function () {
        var vertices = [[0,0,0],[2,0,0],[0,2,0],[0,0,2], [2,2,2], [2,2,0]]
          , faces3d = [[0,1,2,3],[2,3,1,4],[2,1,5,4]]
          , faces2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0],  [3,1,4],[4,1,2],[2,3,4],[1,3,2],  [1,5,4],[4,5,2],[2,1,4],[5,1,2] ]
          , faces1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1],
                       [1,4],[4,3],[3,1],[1,2],[2,4],[4,1],[3,4],[4,2],[2,3],[3,2],[2,1],[1,3],
                       [5,4],[4,1],[1,5],[5,2],[2,4],[4,5],[1,4],[4,2],[2,1],[1,2],[2,5],[5,1]
                      ]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(faces1d)) // 1D
            , new Uint32Array(simplexn._flat(faces2d)) // 2D
            , new Uint32Array(simplexn._flat(faces3d)) // 3D
            ]
          , sc = new simplexn.SimplicialComplex(vertices, faces3d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(simplexn._areEqual(topology[3], expectedFaces[3])).to.be.ok();
        expect(simplexn._areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(simplexn._areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(simplexn._areEqual(topology[0], expectedFaces[0])).to.be.ok();
      });

      it('correctly computes topology of a 4D simplex', function () {
        var vertices = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]]
          , faces4d = [[0,1,2,3,4]]
          , faces3d = [[1,2,3,4],[4,2,3,0],[0,1,3,4],[4,1,2,0],[0,1,2,3]]
          , faces2d = [[2,3,4],[4,3,1],[1,2,4],[3,2,1],
                       [2,3,0],[0,3,4],[4,2,0],[3,2,4],
                       [1,3,4],[4,3,0],[0,1,4],[3,1,0],
                       [1,2,0],[0,2,4],[4,1,0],[2,1,4],
                       [1,2,3],[3,2,0],[0,1,3],[2,1,0]
                      ]
          , faces1d = [[3,4],[4,2],[2,3],[3,1],[1,4],[4,3],[2,4],[4,1],[1,2],[2,1],[1,3],[3,2],
                       [3,0],[0,2],[2,3],[3,4],[4,0],[0,3],[2,0],[0,4],[4,2],[2,4],[4,3],[3,2],
                       [3,4],[4,1],[1,3],[3,0],[0,4],[4,3],[1,4],[4,0],[0,1],[1,0],[0,3],[3,1],
                       [2,0],[0,1],[1,2],[2,4],[4,0],[0,2],[1,0],[0,4],[4,1],[1,4],[4,2],[2,1],
                       [2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1]
                      ]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(faces1d)) // 1D
            , new Uint32Array(simplexn._flat(faces2d)) // 2D
            , new Uint32Array(simplexn._flat(faces3d)) // 3D
            , new Uint32Array(simplexn._flat(faces4d)) // 4D
            ]
          , sc = new simplexn.SimplicialComplex(vertices, faces4d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(simplexn._areEqual(topology[4], expectedFaces[4])).to.be.ok();
        expect(simplexn._areEqual(topology[3], expectedFaces[3])).to.be.ok();
        expect(simplexn._areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(simplexn._areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(simplexn._areEqual(topology[0], expectedFaces[0])).to.be.ok();
      });
    });

    describe('#equals(simpcomp)', function () {

      it('states that 2 simplicial complex made by the same vertices and faces are equal', function () {
        var vertices = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]]
          , faces = [[0,1,2,3,4]]
          , simpcomp1 = new simplexn.SimplicialComplex(vertices, faces)
          , simpcomp2 = new simplexn.SimplicialComplex(vertices, faces)
          ;

        expect(simpcomp1.equals(simpcomp2)).to.be.ok();
      });

      it('states that 2 simplicial complex made by different vertices and same faces are not equal', function () {
        var vertices1 = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]]
          , vertices2 = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0.4,0,2]]
          , faces = [[0,1,2,3,4]]
          , simpcomp1 = new simplexn.SimplicialComplex(vertices1, faces)
          , simpcomp2 = new simplexn.SimplicialComplex(vertices2, faces)
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });

      it('states that 2 simplicial complex made by same vertices and different faces are not equal', function () {
        var vertices = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]]
          , faces1 = [[0,1,2,3,4]]
          , faces2 = [[0,1,4,3,2]]
          , simpcomp1 = new simplexn.SimplicialComplex(vertices, faces1)
          , simpcomp2 = new simplexn.SimplicialComplex(vertices, faces2)
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });

      it('states that 2 simplicial complex made by same vertices and faces of different dimension are not equal', function () {
        var vertices = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]]
          , faces1 = [[0,1,2,3,4]]
          , faces2 = [[1,2,3,4],[4,2,3,0],[0,1,3,4],[4,1,2,0],[0,1,2,3]]
          , simpcomp1 = new simplexn.SimplicialComplex(vertices, faces1)
          , simpcomp2 = new simplexn.SimplicialComplex(vertices, faces2)
          ;

        expect(simpcomp1.equals(simpcomp2)).to.not.be.ok();
      });
    });
  });

}(this));
