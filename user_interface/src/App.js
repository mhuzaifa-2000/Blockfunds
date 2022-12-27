import "./App.css";
import Web3 from "web3";
import { useEffect, useState } from "react";
import Blockfunds from "./contracts/Blockfunds.json";
import Causes from "./contracts/Causes.json";
import Donors from "./contracts/Donors.json";

const blockfundsAbi = Blockfunds.abi;
const causesAbi = Causes.abi;
const DonorsAbi = Donors.abi;
const blockfundsAddress = "0x30df32894692b8e1E3e0E2Cd22893a99c60f6F81";
const causesAddress = "0xfa255a104D97A5862156D02AFaBBF0c08fE88527";
const donorsAddress = "0x921b82afeBf78EE8EcEB3000a6656Bfe39519c0E";

function App() {
  const [account, setAccount] = useState("");
  const [donors, setDonors] = useState({});
  const [causes, setCauses] = useState({});
  const [blockfunds, setBlockfunds] = useState({});
  const cause_id = [1, 2, 3, 4, 5, 6];
  const cause_name = ["a", "b", "c", "d", "e", "f"];
  const cause_collected_amount = [233, 232, 11, 33, 55, 53];
  const cause_target_amount = [3322, 55331, 32, 32, 33, 55];

  const handleAddDonorsAddress = async (e) => {
    e.preventDefault();
    const resp = await blockfunds.methods
      .setDonorsAddress(e.target[0].value)
      .send({ from: account, gas: 3000000 });

    console.log("Resp", resp);
  };
  const handleAddCausesAddress = async (e) => {
    e.preventDefault();
    const resp = await blockfunds.methods
      .setCausesAddress(e.target[0].value)
      .send({ from: account, gas: 3000000 });

    console.log("Resp", resp);
  };
  const handleAddBlockfundsAddress = async (e) => {
    e.preventDefault();
    let resp = await donors.methods
      .setBlockfundsAddress(e.target[0].value)
      .send({ from: account });
    resp = await causes.methods
      .setBlockfundsAddress(e.target[0].value)
      .send({ from: account });

    console.log("Resp", resp);
  };
  const handleDonate = async (e) => {
    e.preventDefault();
    const form = e.target;
    // const etherValue = Web3.utils.fromWei(
    //   String(form["amount"].value),
    //   "ether"
    // // );
    // console.log(etherValue);
    let resp = await donors.methods
      .donate(
        Number(e.target["donor_id"].value),
        Number(e.target["cause_id"].value)
      )
      .send({
        from: e.target["donor_address"].value,
        value: form["amount"].value,
      });
    console.log("Resp", resp);
  };
  const handleAddCause = async (e) => {
    e.preventDefault();
    let resp = await causes.methods
      .addCause(
        e.target["cause_name"].value,
        e.target["activist_name"].value,
        e.target["target_amount"].value,
        e.target["time_threshold"].value
      )
      .send({ from: account, gas: 3000000 });
    console.log("Resp", resp);
  };
  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3("http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const blockfundContract = new web3.eth.Contract(
        blockfundsAbi,
        blockfundsAddress
      );
      const causesContract = new web3.eth.Contract(causesAbi, causesAddress);
      const donorsContract = new web3.eth.Contract(DonorsAbi, donorsAddress);
      setBlockfunds(blockfundContract);
      setDonors(donorsContract);
      setCauses(causesContract);
      setAccount(accounts[0]);
    };
    loadBlockchainData();
  }, []);
  console.log("Causes", causes?.methods);
  console.log("Donors", donors?.methods);
  console.log("Blockfunds", blockfunds?.methods);
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Account: {account}
            </h1>
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Connect Contracts
            </h1>

            <form onSubmit={handleAddDonorsAddress}>
              <div className="my-3 flex items-center ">
                <input
                  type="text"
                  name="donor_address"
                  className="h-12 pl-2 border-gray-300 rounded-lg mr-2 border-2  w-3/4 "
                  placeholder="Donors Contract Address"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Add Address
                </button>
              </div>
            </form>
            <form onSubmit={handleAddCausesAddress}>
              <div className="my-3 flex items-center ">
                <input
                  type="text"
                  name="causes_address"
                  className="h-12 pl-2 border-gray-300 rounded-lg mr-2 border-2  w-3/4 "
                  placeholder="Causes Contract Address"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Add Address
                </button>
              </div>
            </form>
            <form onSubmit={handleAddBlockfundsAddress}>
              <div className="my-3 flex items-center ">
                <input
                  type="text"
                  name="causes_address"
                  className="h-12 pl-2 border-gray-300 rounded-lg mr-2 border-2  w-3/4 "
                  placeholder="Blockfund Contract Address"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Add Address
                </button>
              </div>
            </form>

            <footer className="p-4 flex justify-center"></footer>
          </div>
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Donate
            </h1>

            <form onSubmit={handleDonate}>
              <div className="my-3">
                <input
                  type="number"
                  name="donor_id"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Donor ID"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="donor_address"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Donor Address"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="cause_id"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Cause ID"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="amount"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Amount"
                />
              </div>
              <footer className="p-4 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg"
                >
                  Donate
                </button>
              </footer>
            </form>
          </div>
        </div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white"></div>
      </div>
      <div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Add Cause
            </h1>

            <form onSubmit={handleAddCause}>
              <div className="my-3">
                <input
                  type="text"
                  name="cause_name"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Cause Name"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="activist_name"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Activist Name"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="activist_address"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Activist Address"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="target_amount"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Target Amount"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="time_threshold"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Time Threshold"
                />
              </div>
              <footer className="p-4 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg"
                >
                  Add Cause
                </button>
              </footer>
            </form>
          </div>
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              All Causes
            </h1>

            <form
            //  onSubmit={handleTransfer}
            >
              <div className="overflow-x-auto">
                <table className="table mt-10 mb-10 w-full">
                  <thead>
                    <tr>
                      <th>Cause ID</th>
                      <th>Cause Name</th>
                      <th>Collected Amount</th>
                      <th>Target Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cause_id?.map((causeID, index) => {
                      return (
                        <tr>
                          <th>{causeID}</th>
                          <td align="center">{cause_name[index]}</td>
                          <td align="center">
                            {cause_collected_amount[index]}
                          </td>
                          <td align="center">{cause_target_amount[index]}</td>{" "}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <footer className="p-4 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg"
                >
                  Refresh
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
