import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import useContract from "../hooks/useContract";
import { formatEtherscanLink, shortenHex } from "../util";
import WizardStorage_ABI from "../contracts/WizardStorage.json";
import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";
import { useStore } from "../pages/index";

type Props = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: Props) => {
  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError,
  } = useWeb3React();

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();

  useLayoutEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

const ENSName = useENSName(account);
const wizardsContract = useContract("0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42", ForgottenRunesWizardsCultAbi);
const storageContract = useContract("0x11398bf5967Cd37BC2482e0f4E111cb93D230B05", WizardStorage_ABI);
const wizardTraits = require("../data/traits.json");
const verified = {};

function WizardGrid({
  wizards
}: {
  wizards: any[];
}) {
  const setWizard = useStore(state => state.setWizard);

  return (
        <div style={{"display": "flex", "flexDirection": "row", "flexWrap": "wrap", "alignContent": "center", "justifyContent": "center"}}>
        {wizards.map((wizard: any) => (
          <div key={wizard} style={{"opacity": verified[wizard] ? "50%":"100%", "backgroundImage": "url('/frame.png')", "backgroundSize": "cover", "width": "12em", "height": "12em", "display": "flex", "flexDirection": "column", "alignContent": "center", "justifyContent": "flex-start", "alignItems": "center"}}>
          <div style={{ "marginRight": "2.8em", "marginLeft": "3em", "height": "1.8em", "display": "flex", "alignItems": "center"}}>
            <h3 style={{"fontSize": "0.6em", "fontFamily": "Alagard", "color": "rgb(223, 209, 168)"}}> {wizardTraits['names'][wizard][1]}</h3>
          </div>
          <img
            src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
            style={{"width":"9em", "height":"9em"}}
            onClick={
                verified[wizard] ? undefined: () => { setWizard(wizard); }
            }
          />
          </div>
        ))}
        </div>
  );
}

function WizardList() {
  const [wizards, setWizards] = useState([]);

  useEffect(() => {
    async function run() {
      const tokens: any = [];
      try {
        const result = await wizardsContract.tokensOfOwner(account);

        for (var element of result) {
          tokens.push(Number(element._hex));
          const balance = await storageContract.hasTraitsStored(Number(element._hex));
          verified[Number(element._hex)] = balance;
        }

      } catch (err) {
        console.log("err: ", err);
      }
      setWizards(tokens);
    }
    run();
  }, []);

  return <WizardGrid wizards={wizards}/>
}

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    const hasMetaMaskOrWeb3Available =
      MetaMaskOnboarding.isMetaMaskInstalled() ||
      (window as any)?.ethereum ||
      (window as any)?.web3;

    return (
      <div style={{"marginLeft":"auto", "marginRight":"auto"}}>
        {hasMetaMaskOrWeb3Available ? (
          <button  style={{"marginLeft":"10px", "marginTop":"10px","padding":"5px", "color":"white", "backgroundColor": "black", "border":"solid", "borderBlockColor": "white"}}
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {MetaMaskOnboarding.isMetaMaskInstalled()
              ? "Connect to MetaMask"
              : "Connect to Wallet"}
          </button>
        ) : (
          <button onClick={() => onboarding.current?.startOnboarding()}>
            Install Metamask
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{"padding":"20px", "marginLeft": "auto", "marginRight": "auto", "marginBottom": "1em", "maxHeight": "49em", "maxWidth": "75%", "overflow": "scroll"}}>
      <WizardList/>   
    </div>
  );
};

export default Account;
