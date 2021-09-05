import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useWizardIsVerified from "../hooks/useWizardIsVerified";
import useStorageContract from "../hooks/useWizardStorage";
import useInput from "../hooks/useInput";
import Button from "./button";
import useENSName from "../hooks/useENSName";
import {useFetch} from "../hooks/useFetch";
import NumericalInput from "./numericalInput";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
const wizardTraits = require("../data/traits.json");
import { useMemo, useState } from "react";

const storageAddress = "0xe5a0b43035F0cf0b577d176Ffc9a3ff307205af3";

const WizardVerification = () => {
  const { account } = useWeb3React<Web3Provider>();

  const idInput = useInput("");


  const storageContract = useStorageContract(storageAddress);

  const {data: isVerified} =  useWizardIsVerified(idInput?.value, storageAddress);

  let traits = wizardTraits.traits[idInput?.value]
  let name = wizardTraits.names[idInput?.value]
  const ENSName = useENSName(account);


  let response = useFetch("https://api.opensea.io/api/v1/assets?owner="+ENSName+"&token_ids="+idInput?.value+"&asset_contract_address=0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42&order_direction=desc&offset=0&limit=20")
  
  async function verifyWizard() {

  const proofTraits = getProofForTraits(traits)
  const proofName = getProofForName(name)

    try {
      const transaction = await storageContract.storeWizardTraits(
        idInput?.value,
        name[1],
        traits,
        proofName,
        proofTraits,
      );

      await transaction.wait();

    } catch (error) {
      console.log(error)
    }
  }

  return(
    <div className="flex-1">
          
      <NumericalInput
        name="wizardId"
        id="wizardId"
        required
        {...idInput.valueBind}
      />

      <Button
        onClick={verifyWizard}
        disabled={
          !(idInput.hasValue) ||isVerified 
        }
      >
        {!isVerified ? idInput.hasValue 
          ? `Verify`
          : `Enter Id`: "already Verified"}
      </Button>

      <br></br>
        
      <h3 style={{"marginTop":30}}>
        {idInput.hasValue? <div>{name[1]}</div>: `Enter Id`}
      </h3>
        
        <div>
          {
            response?.assets ?  
              <div>
              <img src={response?.assets[0].image_url} alt=""/>
             </div>:
             idInput.hasValue? <div> Loading...</div>: ''
              
          }
        </div>
        <h3>
        Traits:
        </h3>
          <div>{idInput.hasValue? 
            <div>
              <p> Background: {traits[1] != 7777 ? traits[1]:"None"}</p>
              <p> Body: {traits[2] != 7777 ? traits[2]:"None"}</p>
              <p> Familiar: {traits[3] != 7777 ? traits[3]:"None"}</p>
              <p> Head: {traits[4] != 7777 ? traits[4]:"None"}</p>
              <p> Rune: {traits[5] != 7777 ? traits[5]:"None"}</p>
              <p> Prop: {traits[6] != 7777 ? traits[6]:"None"}</p>
            </div>
            : ``}
          </div>
    </div>
  );
};

export default WizardVerification;
