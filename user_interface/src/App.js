import logo from "./logo.svg";
import "./App.css";

function App() {
  const cause_id = [1, 2, 3, 4, 5, 6];
  const cause_name = ["a", "b", "c", "d", "e", "f"];
  const cause_collected_amount = [233, 232, 11, 33, 55, 53];
  const cause_target_amount = [3322, 55331, 32, 32, 33, 55];
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
        <form className="m-4"></form>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Donate
            </h1>

            <form
            //  onSubmit={handleTransfer}
            >
              <div className="my-3">
                <input
                  type="number"
                  name="recipient"
                  className="h-12 pl-2 border-gray-300 rounded-lg border-2  w-full "
                  placeholder="Donor ID"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="amount"
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
                  Transfer
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

            <form
            //  onSubmit={handleTransfer}
            >
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
