import "./styles.css";
import "./TableHeader/index";
import TableHeader from "./TableHeader/index";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import {
  formatToMoney,
  formatToDate,
  capitalizeWord,
} from "../../utils/formaters";
import ConfirmChoose from "../ConfirmDelete";
import { useState } from "react";

function TransactionsList({
  transactions,
  setCurrentTransactions,
  setReload,
  reload,
  handleOrderTransactions,
}) {
  const [idItemDelete, setIdItemDelete] = useState(null);

  async function handleDeleteItem() {
    const response = await fetch(
      `http://localhost:3333/transactions/${idItemDelete}`,
      {
        method: "DELETE",
      }
    );

    setIdItemDelete(null);
    setReload(!reload);

    console.log(await response.json());
  }

  return (
    <div className="table">
      <TableHeader
        transactions={transactions}
        handleOrderTransactions={handleOrderTransactions}
      />
      <div className="table-body">
        {transactions.map((item) => {
          return (
            <div className="table-line" key={item.id}>
              <div className="line-items">{formatToDate(item.date)}</div>
              <div className="line-items">{item.week_day}</div>
              <div className="line-items">{item.description}</div>
              <div className="line-items">{item.category}</div>
              <div
                className="line-items"
                style={{
                  color: item.type === "credit" ? "#7B61FF" : "#FA8C10",
                }}
              >
                {formatToMoney(item.value)}
              </div>
              <div className="line-items">
                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="action-button"
                  onClick={() => setCurrentTransactions(item)}
                ></img>
                <img
                  src={deleteIcon}
                  alt="edit-icon"
                  className="action-button"
                  onClick={() => setIdItemDelete(item.id)}
                ></img>
                <ConfirmChoose
                  show={item.id === idItemDelete}
                  setClose={() => setIdItemDelete(null)}
                  message="Apagar item?"
                  handleConfirm={() => handleDeleteItem()}
                ></ConfirmChoose>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionsList;
