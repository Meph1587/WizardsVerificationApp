import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import WizardVerification from "../components/WizardVerfication";
import useEagerConnect from "../hooks/useEagerConnect";
import ReactTooltip from 'react-tooltip';
import create from 'zustand';

type State = {
  wizard: Number;
  verifying: Boolean;
  setVerifying: (verifying: Boolean) => void;
  setWizard: (wizard: Number) => void;
}

export const useStore = create<State>(set => ({
  wizard: 0,
  verifying: false,
  setVerifying: (verify) => set(state => ({ verifying: verify })),
  setWizard: (id) => set(state => ({ wizard: id }))
}));

const Verifying = ({verifying}) => {

  const wizard = useStore(state => state.wizard);

  if (!verifying) {
    return (null)
  } else {
    return (
      <div style={{"position": "absolute", "top": "10em", "bottom": "0", "left": "0", "right": "0", "marginLeft" : "auto", "marginRight": "auto", "width": "50em", "height": "20em", "background": "#000000e3", "display": "flex", "flexDirection": "column", "justifyContent": "center"}}>
      <div className="loading">Verifying Wizard #{wizard}</div>
      </div>
    )
  }
}

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  const wizard = useStore(state => state.wizard);
  const verifying = useStore(state => state.verifying);

  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"100%", "overflow": "scroll"}}>
      <Head>
        <title>The Lost Grimoire </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div style={{"display": "flex", "flexDirection": "column", "alignItems": "stretch", "height": "100vh", "padding": "2rem 2rem", "justifyContent": "space-between"}} >
          <div style={{"marginTop": "-2em"}}>
            <h1 style={{"fontSize": "3.4em"}}>The Lost Grimoire</h1>

            <p style={{"width":"100%", "marginLeft":"auto", "marginRight": "auto", "marginBottom":"0.5em", "marginTop": "-20px"}}>
              <i>
                <b>Verify Your Wizard!</b>
               </i>
            </p>
          </div>
          <nav>
          <Account triedToEagerConnect={triedToEagerConnect} />
          </nav>
          {isConnected && (
            <section style={{"flex": "auto"}}>
              <WizardVerification wizardId={wizard}/>
            </section>
          )}
          <Verifying verifying={verifying}/>
          <div>
          <img style={{"width": "2em", "height": "2em"}} src="/question.png" data-tip="1. Connect Your Wallet 2. Select Your Wizard 3. Click verify and send transaction to verify your wizard's traits on the blockchain!"/>
          <ReactTooltip/>
            <p style={{"fontSize": "80%"}}
              ><i> Contract by <a href="https://twitter.com/Mephistophy" target="_blank" rel="noreferrer">Mephistopheles</a> ---- Website by <a href="https://twitter.com/tv3636" target="_blank" rel="noreferrer">tv</a> </i></p>
              <a
                href="https://rinkeby.etherscan.io/address/0x11398bf5967Cd37BC2482e0f4E111cb93D230B05#readContract"
              >
                <u>Contract on Etherscan</u>
              </a>
          </div>
        </div>
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
