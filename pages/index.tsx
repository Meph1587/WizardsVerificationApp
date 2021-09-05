import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import WizardVerification from "../components/WizardVerfication";
import useEagerConnect from "../hooks/useEagerConnect";

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"150vh"}}>
      <Head>
        <title>The Forgotten Grimoire </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>

        <div  style={{"marginTop":"-50px"}} >
          <div>
            <h1>The Forgotten Grimoire</h1>

            <p style={{"width":"50%", "marginLeft":"25%","marginBottom":"50px"}}>
              <i>
                <b>Grimoire:</b>
                A textbook of magic, typically including instructions on how to perform magical spells, charms and divination, and how to summon or invoke supernatural entities such as angels, spirits, deities and demons. 
              </i>
            </p>
          </div>

          {isConnected && (
            <section>
              <WizardVerification />
            </section>
          )}
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
