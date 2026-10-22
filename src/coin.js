import { generateCylinderObject } from "PotatoEngine/src/objects"

let coinNum = 0
export function generateCoin(){
    const coin = generateCylinderObject("coin", )
    coinNum++;
    
    return coin
}

/**
 * player collide with coin
 * 
 * collect the coin...
 */
function collideCoin(){

}

/**
 * Spin coin, move it towards the camera
 * 
 * maybe should have a shared "move towards camera function" since
 * coins will use, buildings, obstacles
 */
function updateCoin(){

}