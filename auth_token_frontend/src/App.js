import './App.css';
import {useWeb3React} from "@web3-react/core"
import {injected} from "./connectors";
import {useEffect} from "react";


function App() {
    const {active, account, library, activate, deactivate} = useWeb3React()

    async function connect() {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    useEffect(() => {
        // listen for changes on an Ethereum address
        console.log(`effect, account: ${account}, active: ${active}`)
        // trigger the effect only on component mount
    }, [account, active])

    function generateSignedMessage() {
        library.getSigner(account).signMessage('auth').then((signature) => {
            console.log(signature)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (

        <div className="App">
            <div className="flex flex-col items-center justify-center">
                <button onClick={connect}
                        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect
                    to MetaMask
                </button>
                {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
                <button onClick={disconnect}
                        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect
                </button>
                <button onClick={generateSignedMessage}>Generate message</button>
            </div>
        </div>
    );
}

export default App;
