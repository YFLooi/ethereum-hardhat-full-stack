import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

// Does not sound practical as contracts are mode..
// should use fs to grab the file instead
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";
// Address logged upon running "npx hardhat run scripts/deploy.js --network localhost"
// Contract address may change on redeployment
const greeterAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const ercTokenAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState("");
  const [contractGreeting, setContractGreetingValue] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState("");

  // req access to metamask account
  async function requestAccount() {
    // window.ethereum global provided by ether.js?
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current greeting value
  // by calling the greet() method in Greeter.sol
  async function getGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
        setContractGreetingValue(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      // Connect to metamask account
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      // Call the setGreeting() method in Greeter.sol
      const transaction = await contract.setGreeting(greeting);

      await transaction.wait();
      getGreeting();
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);

      try {
        const balance = await contract.balanceOf(account);
        console.log("Balance: ", balance.toString());
      } catch (err) {
        console.log("Error getting Token contract balance: ", err);
      }
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      // Connect to metamask account
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      // Call the setGreeting() method in Greeter.sol
      const transaction = await contract.transfer(userAccount, amount);

      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function getErcBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ercTokenAddress,
        Token.abi,
        provider
      );

      try {
        const balance = await contract.balanceOf(account);
        console.log("Balance: ", balance.toString());
      } catch (err) {
        console.log("Error getting ERC20 Token contract balance: ", err);
      }
    }
  }

  async function sendErcCoins() {
    if (typeof window.ethereum !== "undefined") {
      // Connect to metamask account
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ercTokenAddress, Token.abi, signer);
      // Call the setGreeting() method in Greeter.sol
      const transaction = await contract.transfer(userAccount, amount);

      await transaction.wait();
      console.log(`${amount} ERC20 Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <div>
        <header className="App-header">
          ErcToken.sol smart contract interaction interface
        </header>
        <button onClick={getErcBalance}>Get Balance</button>
        <button onClick={sendErcCoins}>Send Coins</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </div>
      <div>
        <header className="App-header">
          Token.sol smart contract interaction interface
        </header>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </div>
      <div>
        <header className="App-header">
          Greeter.sol smart contract interaction interface
        </header>
        <div className="greeting-display">
          <div>Current greeting in state.greeting:</div>
          <div>{greeting}</div>
        </div>
        <div className="greeting-display">
          <div>Current greeting in contract:</div>
          <div>{contractGreeting}</div>
        </div>
        <div>
          <div>
            <button onClick={getGreeting}>Fetch Greeting</button>
          </div>
          <div>
            <input
              onChange={(e) => setGreetingValue(e.target.value)}
              placeholder="Set greeting"
            />
            <button onClick={setGreeting}>Set Greeting</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
