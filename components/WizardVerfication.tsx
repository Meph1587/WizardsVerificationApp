import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useWizardIsVerified from "../hooks/useWizardIsVerified";
import useStorageContract from "../hooks/useWizardStorage";
import useInput from "../hooks/useInput";
import Button from "./button";
import NumericalInput from "./numericalInput";
import {getProofForTraits, getWizardTraits} from "../utils/makeMerkleProof";
import { useMemo, useState } from "react";

const storageAddress = "0x78dd5d19Dc9FebD05459AA99886600Da910A13a9";

const WizardVerification = () => {
  const { account } = useWeb3React<Web3Provider>();

  const idInput = useInput("");


  const storageContract = useStorageContract(storageAddress);

  const {data: isVerified} =  useWizardIsVerified(idInput?.value, storageAddress);

  let traits = getWizardTraits(idInput?.value)
  const traitsWithId = [parseInt(idInput?.value)].concat(traits)
  
  async function verifyWizard() {
    //const _id = toast.loading("Waiting for confirmation");

  const proof = getProofForTraits(traitsWithId)
  

    try {
      const transaction = await storageContract.storeWizardTraits(
        idInput?.value,
        traitsWithId,
        proof
      );

      //toast.loading(`Approve ${depositToken.symbol}`, { id: _id });

      await transaction.wait();

      //toast.success(`Approve ${depositToken.symbol}`, { id: _id });

    } catch (error) {
      //handleError(error, _id);
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
            <br></br>

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

            <div>Traits: {idInput.hasValue
                ? <div>
                  {traits?.map(txt => <p>{txt}</p>)}
              </div>
                : `Enter Id`}</div>
            
          </div>
  );
};

export default WizardVerification;
