import "./styles.css";
import Header from "../../components/Header";
import TransactionsList from "../../components/TransactionsList";
import Resume from "../../components/Resume";
import ModalStorageTransactions from "../../components/ModalStorageTransactions";
import { useEffect, useState } from "react";
import Filters from "../../components/Filter";

function Main() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    handleLoadTransactions();
  }, [reload]);

  useEffect(() => {
    if (currentTransactions) {
      return setOpen(true);
    }
  }, [currentTransactions]);

  useEffect(() => {
    if (!open) {
      handleLoadTransactions();
    }

    if (!open && currentTransactions) {
      setCurrentTransactions(false);
    }
  }, [open]);

  function handleOrderTransactions(newTransactions) {
    setTransactions(newTransactions);
  }

  async function handleLoadTransactions() {
    const response = await fetch("http://localhost:3333/transactions", {
      method: "GET",
    });
    const data = await response.json();
    setTransactions(data);
  }

  return (
    <div className="container-main">
      <Header />
      <main>
        <div>
          <Filters
            transactions={transactions}
            handleOrderTransactions={handleOrderTransactions}
            reload={reload}
            setReload={setReload}
          />
          <TransactionsList
            transactions={transactions}
            setCurrentTransactions={setCurrentTransactions}
            setReload={setReload}
            reload={reload}
            handleOrderTransactions={handleOrderTransactions}
          />
        </div>
        <div>
          <Resume transactions={transactions} />
          <button className="btn-insert-register" onClick={() => setOpen(true)}>
            Adicionar Registro
          </button>
        </div>
      </main>

      <ModalStorageTransactions
        open={open}
        setOpen={setOpen}
        currentTransactions={currentTransactions}
      />
    </div>
  );
}

export default Main;
