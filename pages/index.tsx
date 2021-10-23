import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import WizardVerification from "../components/WizardVerfication";
import useEagerConnect from "../hooks/useEagerConnect";
import create from 'zustand';

export const useStore = create(set => ({
  wizard: 0,
  setWizard: (id) => set(state => ({ wizard: id }))
}))

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  const wizard = useStore(state => state.wizard);

  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"150vh"}}>
      <Head>
        <title>The Lost Grimoire </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div  style={{"marginTop": "-0.4em"}} >
          <div>
            <h1 style={{"fontSize": "3.4em"}}>The Lost Grimoire</h1>

            <p style={{"width":"50%", "marginLeft":"25%","marginBottom":"0.5em", "marginTop": "-20px"}}>
              <i>
                <b>Verify Your Wizard!</b>
               </i>
            </p>
          </div>
          <nav>
          <Account triedToEagerConnect={triedToEagerConnect} />
          </nav>
          {isConnected && (
            <section>
              <WizardVerification wizardId={wizard}/>
            </section>
          )}
          <div style={{"bottom": "20px", "position": "relative"}}>
            <p style={{"fontSize": "80%"}}
              ><i> --- Rinkeby Only! --- </i></p>
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
