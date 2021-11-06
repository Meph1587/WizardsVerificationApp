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
import { useStore } from "../pages/index";

const storageAddress = "0x11398bf5967Cd37BC2482e0f4E111cb93D230B05";

const WizardVerification = ({ wizardId }) => {
  const { account } = useWeb3React<Web3Provider>();

  const storageContract = useStorageContract(storageAddress);

  const {data: isVerified} =  useWizardIsVerified(wizardId, storageAddress);

  let traits = wizardTraits.traits[wizardId]
  let name = wizardTraits.names[wizardId]
  const ENSName = useENSName(account);
  const setVerifying = useStore(state => state.setVerifying);


  let response = useFetch("https://api.opensea.io/api/v1/assets?owner="+ENSName+"&token_ids="+wizardId+"&asset_contract_address=0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42&order_direction=desc&offset=0&limit=20")
  
  async function verifyWizard() {

  const proofTraits = getProofForTraits(traits)
  const proofName = getProofForName(name)

    try {
      setVerifying(true);

      const transaction = await storageContract.storeWizardTraits(
        wizardId,
        name[1],
        traits,
        proofName,
        proofTraits,
      );

      const result = await transaction.wait();
      setVerifying(false);

    } catch (error) {
      console.log(error)
      setVerifying(false);
    }
  }

  return(
    <div className="flex-1">
          
      <Button
        onClick={verifyWizard}
        disabled={
          !(wizardId) ||isVerified 
        }
      >
        {!isVerified ? wizardId
          ? `Verify`
          : `Verify`: "already Verified"}
      </Button>

      <br></br>
        <div style={{"display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "flex-end", "bottom": "0em", "position" : "relative", "marginRight": "3em"}}>
          <div style={{"marginTop": "5em"}}>
            <div>
              <img src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizardId + ".png"} alt=""/>
            </div>
          </div>
            <div style={{"marginBottom": "50px"}}>{wizardId? 
              <div>
                <h3>
                Traits:
                </h3>
                <p> Background: {traits[1] != 7777 ? traits[1]:"None"}</p>
                <p> Body: {traits[2] != 7777 ? traits[2]:"None"}</p>
                <p> Familiar: {traits[3] != 7777 ? traits[3]:"None"}</p>
                <p> Head: {traits[4] != 7777 ? traits[4]:"None"}</p>
                <p> Prop: {traits[5] != 7777 ? traits[5]:"None"}</p>
                <p> Rune: {traits[6] != 7777 ? traits[6]:"None"}</p>
              </div>
              : ``}
            </div>
          </div>
    </div>
  );
};

export default WizardVerification;
