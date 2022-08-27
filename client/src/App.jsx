import detectEthereumProvider from "@metamask/detect-provider";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { loadContract } from "./utils/load-contract";

function App() {


  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });


  const [account, setAccount] = useState(null);
  const[add,setadd]=useState()
  const [balance, setBalance] = useState(null);
  const [reload,setreload]=useState(false);
  const [no,setno]=useState(false);

  // const setReload=()=>{
  //   if(reload===true){
  //     setreload(false)
  //   }
  //   else{
  //     setReload(true)
  //   }
  // }
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
  };



  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
     const contract = await loadContract("Lottery", provider);
      if (provider) {
        setAccountListener(provider);
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error("Please install MetaMask");
      }
    };

    loadProvider();
  },[]);

  useEffect(() => {
    const loadBalance = async () => {
      const {  contract,web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api,reload]);


  const transferFund = async () => {
    const {  web3,contract } = web3Api;
    await contract.lotterypart({
      from: account,
      value: web3.utils.toWei("1", "ether"),

    });
    setreload(!reload);
  }

    
  const pickwinner = async () => {
    const {  contract,web3 } = web3Api;
    await contract.pikwinner({from : account});

    const addd=await contract.winner.call();

    setadd(addd)

  }
// useEffect(()=>{
//   const win=async()=>{
//     const {contract,web3}=web3Api;
//     const appp= await contract.winner;
//     setadd(appp);
//   }
//  no===true && win();
//   },[web3Api,no])


  return (
    <>
    <div><h1>Lottery Nirbhay</h1></div>
    <div>{balance}</div>
    <div><button onClick={transferFund}>Participate karna hain min 1 eth</button></div>
    <div><button onClick={pickwinner}>Pickwinner Manager</button></div>
    <div>winner is:-{add}</div>
    </>
  );
}

export default App;
