!(function () {

  var flat = function (arrays) {
    var res = [];

    arrays.forEach(function (item) {
      res = res.concat(item);
    });

    return res;
  };

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
  };

  describe('SimplicialComplex', function () {

    describe('#_computeTopology()', function () {

      it('correctly computes topology of a simplicial complex made by one tetrahedron', function () {
        var vertex = [[0,0,0],[2,0,0],[0,2,0],[0,0,2]]
          , faces3d = [[0,1,2,3]]
          , faces2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0]]
          , faces1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1]]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(flat(faces1d)) // 1D
            , new Uint32Array(flat(faces2d)) // 2D
            , new Uint32Array(flat(faces3d)) // 3D
            ]
          , sc = new simplexn.SimplicialComplex(vertex, faces3d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(topology[0]).to.be.a(Uint32Array);
        expect(topology[1]).to.be.a(Uint32Array);
        expect(topology[2]).to.be.a(Uint32Array);
        expect(topology[3]).to.be.a(Uint32Array);
        expect(areEqual(topology[0], expectedFaces[0])).to.be.ok();
        expect(areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(areEqual(topology[3], expectedFaces[3])).to.be.ok();
      });

      it('correctly computes topology of a simplicial complex made by one tetrahedron whit unuseful points', function () {
        var vertex = [[0,0,0],[2,0,0],[5.6,6.7,3.4],[0,2,0],[0,0,2],[1.5,3.5,0]]
          , faces3d = [[0,1,3,4]]
          , faces2d = [[1,3,4],[4,3,0],[0,1,4],[3,1,0]]
          , faces1d = [[3,4],[4,1],[1,3],[3,0],[0,4],[4,3],[1,4],[4,0],[0,1],[1,0],[0,3],[3,1]]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(flat(faces1d)) // 1D
            , new Uint32Array(flat(faces2d)) // 2D
            , new Uint32Array(flat(faces3d)) // 3D
            ]
          , sc = new simplexn.SimplicialComplex(vertex, faces3d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(topology[0]).to.be.a(Uint32Array);
        expect(topology[1]).to.be.a(Uint32Array);
        expect(topology[2]).to.be.a(Uint32Array);
        expect(topology[3]).to.be.a(Uint32Array);
        expect(areEqual(topology[0], expectedFaces[0])).to.be.ok();
        expect(areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(areEqual(topology[3], expectedFaces[3])).to.be.ok();
      });

      it('correctly computes topology of a simplicial complex made by three tetrahedrons', function () {
        var vertex = [[0,0,0],[2,0,0],[0,2,0],[0,0,2], [2,2,2], [2,2,0]]
          , faces3d = [[0,1,2,3],[2,3,1,4],[2,1,5,4]]
          , faces2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0],  [3,1,4],[4,1,2],[2,3,4],[1,3,2],  [1,5,4],[4,5,2],[2,1,4],[5,1,2] ]
          , faces1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1],
                       [1,4],[4,3],[3,1],[1,2],[2,4],[4,1],[3,4],[4,2],[2,3],[3,2],[2,1],[1,3],
                       [5,4],[4,1],[1,5],[5,2],[2,4],[4,5],[1,4],[4,2],[2,1],[1,2],[2,5],[5,1]
                      ]
          , expectedFaces = [
              new Uint32Array() // 0D 
            , new Uint32Array(flat(faces1d)) // 1D
            , new Uint32Array(flat(faces2d)) // 2D
            , new Uint32Array(flat(faces3d)) // 3D
            ]
          , sc = new simplexn.SimplicialComplex(vertex, faces3d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(topology[0]).to.be.a(Uint32Array);
        expect(topology[1]).to.be.a(Uint32Array);
        expect(topology[2]).to.be.a(Uint32Array);
        expect(topology[3]).to.be.a(Uint32Array);
        expect(areEqual(topology[3], expectedFaces[3])).to.be.ok();
        expect(areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(areEqual(topology[0], expectedFaces[0])).to.be.ok();
      });

      it('correctly computes topology of a 4D simplex', function () {
        var vertex = [[0,0,0,0],[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]]
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
            , new Uint32Array(flat(faces1d)) // 1D
            , new Uint32Array(flat(faces2d)) // 2D
            , new Uint32Array(flat(faces3d)) // 3D
            , new Uint32Array(flat(faces4d)) // 4D
            ]
          , sc = new simplexn.SimplicialComplex(vertex, faces4d)
          , topology = sc.topology
          ;

        expect(topology).to.be.a(Array);
        expect(topology[0]).to.be.a(Uint32Array);
        expect(topology[1]).to.be.a(Uint32Array);
        expect(topology[2]).to.be.a(Uint32Array);
        expect(topology[3]).to.be.a(Uint32Array);
        expect(topology[4]).to.be.a(Uint32Array);
        expect(areEqual(topology[4], expectedFaces[4])).to.be.ok();
        expect(areEqual(topology[3], expectedFaces[3])).to.be.ok();
        expect(areEqual(topology[2], expectedFaces[2])).to.be.ok();
        expect(areEqual(topology[1], expectedFaces[1])).to.be.ok();
        expect(areEqual(topology[0], expectedFaces[0])).to.be.ok();
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
