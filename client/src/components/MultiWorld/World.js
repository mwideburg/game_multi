import * as THREE from "three";
import  Ground  from './Ground'
import  Trees from './Trees'
export default function world(){
    const objects = []
    objects.push( Ground() )
    const trees = Trees()
    trees.forEach(obj => objects.push(obj))
    return objects
}

