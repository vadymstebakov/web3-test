import { useEffect, useRef } from 'react';
import { injected } from '../components/Wallet/connectors';
import { useWeb3React } from '@web3-react/core';

export default function Home() {
    const inputEthRef = useRef(null);
    const { activate, deactivate, account, library, active, connector, chainId, setError, error } = useWeb3React();
    console.log(account);
    useEffect(() => {
        if (!window?.ethereum) {
            return;
        }

        console.log('log', library);
        console.log('chain', library?.eth?.defaultChain);

        const checkBalance = async () => {
            const balance = await library?.eth?.getBalance(account);
            console.log('balance', balance);
            console.log('parse balance', library?.utils?.fromWei(balance));
        };
        checkBalance();

        const getAccount = () => {
            library?.eth?.getAccounts(console.log);
        };
        getAccount();
    }, [library, account]);

    const connectHandler = async () => {
        try {
            await activate(injected);
        } catch (error) {
            console.error(error.message);
        }
    };

    const disconnectHandler = () => {
        try {
            deactivate();
        } catch (error) {
            console.error(error.message);
        }
    };

    const transactionHandler = async e => {
        e.preventDefault();

        const ethValue = inputEthRef.current.value;

        if (!ethValue || !account) {
            console.log(ethValue);
            return;
        }

        const tx = await library.eth.sendTransaction({
            to: account,
            from: account,
            value: library.utils.toWei(ethValue),
        });

        console.log(tx);
    };

    return (
        <>
            <div>
                <button onClick={connectHandler}>Connect to MetaMask</button>
                {active ? (
                    <span>
                        Connected with <b>{account}</b>
                    </span>
                ) : (
                    <span>Not connected</span>
                )}
                <button onClick={disconnectHandler}>Disconnect</button>
            </div>
            <form onSubmit={transactionHandler}>
                <input type="text" ref={inputEthRef} />
                <button type="submit">Send</button>
            </form>
        </>
    );
}
