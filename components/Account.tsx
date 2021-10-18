import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import useContract from "../hooks/useContract";
import { formatEtherscanLink, shortenHex } from "../util";
import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";

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
var selectedWiz = 0;

function WizardGrid({
  wizards
}: {
  wizards: any[];
}) {
  return (
        <div>
        {wizards.map((wizard: any) => (
          <img
            src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
            style={{"width":"100px", "height":"100px"}}
            onClick={
                () => {
                //console.log(wizard);
                selectedWiz = wizard;
                console.log(selectedWiz);
              }
            }
          />
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

        result.forEach((element: any) => {
          tokens.push(Number(element._hex));
        });

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
    <div style={{"padding":"20px", "marginLeft": "auto", "marginRight": "auto"}}>
      <WizardList/>   
            <p style={{"fontSize": "80%"}}
            ><i> --- Rinkeby Only! --- </i></p>
            <a
              href="https://rinkeby.etherscan.io/address/0x11398bf5967Cd37BC2482e0f4E111cb93D230B05#readContract"
            >
              <u>Contract on Etherscan</u>
            </a>
    </div>
  );
};

export default Account;
