!(function () {

  describe('Topology', function () {
    describe('#equals(pointSet)', function () {
      
      it('states that two topologies made by the same complexes are equal', function () {
        var complexes = [[0,1,2,3],[1,2,3,4]];
        var topology1 = new simplexn.Topology(complexes);
        var topology2 = new simplexn.Topology(complexes);

        expect(topology1.equals(topology2)).to.be.ok();
      });

      it('states that two topologies made by a permutation of the same indices are not equal', function () {
        var complexes1 = [[0,1,2,3],[1,2,3,4]];
        var complexes2 = [[0,1,2,3],[1,3,2,4]];
        var topology1 = new simplexn.Topology(complexes1);
        var topology2 = new simplexn.Topology(complexes2);

        expect(topology1.equals(topology2)).to.not.be.ok();
      });

      it('states that two topologies with different dim are not equal', function () {
        var complexes1 = [[0,1,2,3],[1,2,3,4],[2,3,4,5]];
        var complexes2 = [[0,1,2],[1,3,2],[2,3,4]];
        var topology1 = new simplexn.Topology(complexes1);
        var topology2 = new simplexn.Topology(complexes2);

        expect(topology1.equals(topology2)).to.not.be.ok();
      });

      it('states that two topologies with different length are not equal', function () {
        var complexes1 = [[0,1,2,3],[1,2,3,4],[2,3,4,5]];
        var complexes2 = [[0,1,2,3],[1,3,2,4]];
        var topology1 = new simplexn.Topology(complexes1);
        var topology2 = new simplexn.Topology(complexes2);

        expect(topology1.equals(topology2)).to.not.be.ok();
      });
    });

    describe('#constructor', function () {
       it('correctly contructs an empty topology', function () {
        var topology = new simplexn.Topology();
        var complexes = topology.complexes;

        expect(complexes).to.be.a(Array);
        expect(complexes).to.be.empty();
      });

      it('correctly contructs a topology for a simplicial complex made by one tetrahedron', function () {
        var cells3d = [[0,1,2,3]]
        var cells2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0]];
        var cells1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1]];
        var expectedComplexes = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(cells1d)) // 1D
            , new Uint32Array(simplexn._flat(cells2d)) // 2D
            , new Uint32Array(simplexn._flat(cells3d)) // 3D
            ];
        var topology = new simplexn.Topology(cells3d);
        var complexes = topology.complexes;

        expect(complexes).to.be.a(Array);
        expect(simplexn._areEqual(complexes[0], expectedComplexes[0])).to.be.ok();
        expect(simplexn._areEqual(complexes[1], expectedComplexes[1])).to.be.ok();
        expect(simplexn._areEqual(complexes[2], expectedComplexes[2])).to.be.ok();
        expect(simplexn._areEqual(complexes[3], expectedComplexes[3])).to.be.ok();
      });

      it('correctly contructs a topology for a simplicial complex made by one tetrahedron with unuseful points', function () {
        var cells3d = [[0,1,3,4]]
        var cells2d = [[1,3,4],[4,3,0],[0,1,4],[3,1,0]];
        var cells1d = [[3,4],[4,1],[1,3],[3,0],[0,4],[4,3],[1,4],[4,0],[0,1],[1,0],[0,3],[3,1]];
        var expectedComplexes = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(cells1d)) // 1D
            , new Uint32Array(simplexn._flat(cells2d)) // 2D
            , new Uint32Array(simplexn._flat(cells3d)) // 3D
            ];
        var topology = new simplexn.Topology(cells3d);
        var complexes = topology.complexes;

        expect(complexes).to.be.a(Array);
        expect(simplexn._areEqual(complexes[0], expectedComplexes[0])).to.be.ok();
        expect(simplexn._areEqual(complexes[1], expectedComplexes[1])).to.be.ok();
        expect(simplexn._areEqual(complexes[2], expectedComplexes[2])).to.be.ok();
        expect(simplexn._areEqual(complexes[3], expectedComplexes[3])).to.be.ok();
      });

      it('correctly contructs a topology for a simplicial complex made by three tetrahedrons', function () {
        var cells3d = [[0,1,2,3],[2,3,1,4],[2,1,5,4]];
        var cells2d = [[1,2,3],[3,2,0],[0,1,3],[2,1,0],  [3,1,4],[4,1,2],[2,3,4],[1,3,2],  [1,5,4],[4,5,2],[2,1,4],[5,1,2] ];
        var cells1d = [[2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1],
                       [1,4],[4,3],[3,1],[1,2],[2,4],[4,1],[3,4],[4,2],[2,3],[3,2],[2,1],[1,3],
                       [5,4],[4,1],[1,5],[5,2],[2,4],[4,5],[1,4],[4,2],[2,1],[1,2],[2,5],[5,1]
                      ];
        var expectedComplexes = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(cells1d)) // 1D
            , new Uint32Array(simplexn._flat(cells2d)) // 2D
            , new Uint32Array(simplexn._flat(cells3d)) // 3D
            ];
        var topology = new simplexn.Topology(cells3d);
        var complexes = topology.complexes;

        expect(complexes).to.be.a(Array);
        expect(simplexn._areEqual(complexes[0], expectedComplexes[0])).to.be.ok();
        expect(simplexn._areEqual(complexes[1], expectedComplexes[1])).to.be.ok();
        expect(simplexn._areEqual(complexes[2], expectedComplexes[2])).to.be.ok();
        expect(simplexn._areEqual(complexes[3], expectedComplexes[3])).to.be.ok();
      });

      it('correctly contructs a topology for a 4D simplex', function () {
        var cells4d = [[0,1,2,3,4]];
        var cells3d = [[1,2,3,4],[4,2,3,0],[0,1,3,4],[4,1,2,0],[0,1,2,3]];
        var cells2d = [[2,3,4],[4,3,1],[1,2,4],[3,2,1],
                       [2,3,0],[0,3,4],[4,2,0],[3,2,4],
                       [1,3,4],[4,3,0],[0,1,4],[3,1,0],
                       [1,2,0],[0,2,4],[4,1,0],[2,1,4],
                       [1,2,3],[3,2,0],[0,1,3],[2,1,0]
                      ];
        var cells1d = [[3,4],[4,2],[2,3],[3,1],[1,4],[4,3],[2,4],[4,1],[1,2],[2,1],[1,3],[3,2],
                       [3,0],[0,2],[2,3],[3,4],[4,0],[0,3],[2,0],[0,4],[4,2],[2,4],[4,3],[3,2],
                       [3,4],[4,1],[1,3],[3,0],[0,4],[4,3],[1,4],[4,0],[0,1],[1,0],[0,3],[3,1],
                       [2,0],[0,1],[1,2],[2,4],[4,0],[0,2],[1,0],[0,4],[4,1],[1,4],[4,2],[2,1],
                       [2,3],[3,1],[1,2],[2,0],[0,3],[3,2],[1,3],[3,0],[0,1],[1,0],[0,2],[2,1]
                      ];
        var expectedComplexes = [
              new Uint32Array() // 0D 
            , new Uint32Array(simplexn._flat(cells1d)) // 1D
            , new Uint32Array(simplexn._flat(cells2d)) // 2D
            , new Uint32Array(simplexn._flat(cells3d)) // 3D
            , new Uint32Array(simplexn._flat(cells4d)) // 4D
            ];
        var topology = new simplexn.Topology(cells4d);
        var complexes = topology.complexes;

        expect(complexes).to.be.a(Array);
        expect(simplexn._areEqual(complexes[0], expectedComplexes[0])).to.be.ok();
        expect(simplexn._areEqual(complexes[1], expectedComplexes[1])).to.be.ok();
        expect(simplexn._areEqual(complexes[2], expectedComplexes[2])).to.be.ok();
        expect(simplexn._areEqual(complexes[3], expectedComplexes[3])).to.be.ok();
        expect(simplexn._areEqual(complexes[4], expectedComplexes[4])).to.be.ok();
      });
    });
  });

}(this));