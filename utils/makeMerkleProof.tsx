const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const wizardTraits = require("../data/WizardsToTraits.json");

// Flat version for easier import

export function getProofForTraits(traits:number[]){
    let tree = makeTreeFromTraits(getFormattedTraits())
    let formattedTraits = traits;
    for (let _ = traits.length; _ < 6; _++){
        formattedTraits.push(7777)
    };

    return makeProof(tree, formattedTraits);
}

export function getWizardTraits(wizardId:string){
   for(let i=0; i< wizardTraits.wizards.length; i++){
       if(wizardTraits.wizards[i] == parseInt(wizardId)){
        let formattedTraits = wizardTraits.traits[i];
        for (let _ = wizardTraits.traits[i].length; _ < 6; _++){
            formattedTraits.push(7777)
        };
        return formattedTraits;
       }
   }
}

// Fills all trait lists with "7777" up to 6 elements and adds wizardId
function getFormattedTraits(): number[][]{
    
    let wizards = wizardTraits.wizards;
    let traitsRaw = wizardTraits.traits;

    let traits = [];
    for (let i=0; i< traitsRaw.length;i++){
        let element = traitsRaw[i];
        let filledElement = element;
        for (let _ = element.length; _ < 6; _++){
            filledElement.push(7777)
        }
        traitsRaw[i] = filledElement;
        let id:number[] = [wizards[i]];
        traits.push(id.concat(filledElement))
    };
    return traits;
}

function encode(traits: number[]): any{
    let encoded = "0x0000"
    traits.forEach(element => {
        let trait = element.toString(16);
        let zeroes= "";
        for (let i=0; i < 4 - trait.length; i++){
            zeroes = zeroes + "0";
        }
        encoded += (zeroes + trait)
        
    });
    return encoded
}

function makeProof(tree:any, traits:number[]): any{

    const leaf = keccak256(encode(traits))
    const proof = tree.getHexProof(leaf, keccak256, { hashLeaves: true, sortPairs: true })
    return proof
}

// Encode traits and build tree
function makeTreeFromTraits(leaves:number[][]):any{

    const leavesEncoded = [];
    for(let i=0 ; i< leaves.length; i++){
        leavesEncoded.push(encode(leaves[i]));
    }
    const tree = new MerkleTree(leavesEncoded, keccak256, { hashLeaves: true, sortPairs: true })

    return tree;
}