import * as THREE from "three";
import trunkText from './images/bark_text.jpg'
import treeTop from './images/tree.jpg'
import treeTop2 from './images/tree2.jpg'
export default function Trees(){
    const tops = [treeTop, treeTop2]
    const makeTrunk = () => {
        var loader = new THREE.TextureLoader();
        var tunkTexture = loader.load(trunkText);
        tunkTexture.wrapS = tunkTexture.wrapT = THREE.RepeatWrapping;
        tunkTexture.repeat.set(25, 25);
        tunkTexture.anisotropy = 16;
        tunkTexture.encoding = THREE.sRGBEncoding;

        var material = new THREE.MeshLambertMaterial({ map: tunkTexture });

        const geometry = new THREE.CylinderGeometry(5, 5, 102, 32);
        // this.material = new THREE.MeshLambertMaterial({ color: "rgb(128,128,0)" });

        const mesh = new THREE.Mesh(geometry, material);
        return mesh
    }
    const makeTop = () => {
        var loader = new THREE.TextureLoader();

        var topTexture = loader.load(treeTop);
        topTexture.wrapS = topTexture.wrapT = THREE.RepeatWrapping;
        topTexture.repeat.set(5, 5);
        topTexture.anisotropy = 16;
        topTexture.encoding = THREE.sRGBEncoding;

        var treeMaterial = new THREE.MeshLambertMaterial({ map: topTexture });
        var verticesOfCube = [
            -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
        ];

        var indicesOfFaces = [
            2, 1, 0, 0, 3, 2,
            0, 4, 7, 7, 3, 0,
            0, 1, 5, 5, 4, 0,
            1, 2, 6, 6, 5, 1,
            2, 3, 7, 7, 6, 2,
            4, 5, 6, 6, 7, 4,

        ];

        const geometry = new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, 30, 2);

        
        const mesh = new THREE.Mesh(geometry, treeMaterial);
        return mesh
    }
    const trees = []
    for (let i = 0; i < 75; i++) {
        var trunk = makeTrunk();
        var top = makeTop();

        var tree = new THREE.Group();

        top.position.y = 50
        tree.add(trunk)
        tree.add(top)


        tree.position.x = Math.floor(Math.random() * 20 - 10) * 60;
        tree.position.z = Math.floor(Math.random() * 20 - 10) * 60;
        tree.position.y = Math.floor(Math.random() * 30) + 20;

        trees.push(tree)
        
    }
    return trees
}

