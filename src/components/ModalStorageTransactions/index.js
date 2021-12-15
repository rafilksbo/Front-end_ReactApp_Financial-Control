import "./styles.css";
import closeIcon from "../../assets/close-icon.svg";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { formatToWeek } from "../../utils/formaters";
import { format } from "date-fns";

const defaultValuesForm = {
  value: 0,
  category: "",
  date: "",
  description: "",
};

function ModalStorageTransactions({ open, setOpen, currentTransactions }) {
  const [activeButton, setActiveButton] = useState("debit");
  const [form, setForm] = useState(defaultValuesForm);

  useEffect(() => {
    if (open && !currentTransactions) {
      setForm(defaultValuesForm);
      return;
    }

    if (currentTransactions) {
      setActiveButton(currentTransactions.type);
    }
    setForm({
      date: currentTransactions.date,
      category: currentTransactions.category,
      value: currentTransactions.value,
      description: currentTransactions.description,
    });
  }, [currentTransactions, open]);

  function handleChange(target) {
    const newValueState = { ...form, [target.name]: target.value };
    setForm(newValueState);

    console.log(form);
  }

  async function updateTransaction(body) {
    console.log(body);
    return await fetch(
      `http://localhost:3333/transactions/${currentTransactions.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
  }

  async function registerTransaction(body) {
    return await fetch("http://localhost:3333/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    console.log(form.date);
    const [day, month, year] = form.date.split("/");
    console.log(day, month, year);

    const selectedDate = new Date(`${month}/${day}/${year}`);
    console.log(selectedDate);

    const body = {
      date: selectedDate,
      week_day: formatToWeek(selectedDate),
      description: form.description,
      value: form.value,
      category: form.category,
      type: activeButton, // ENTRADA DE DINHEIRO
    };

    /*const response = await fetch("http://localhost:3333/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });*/

    //const data = await response.json();

    if (currentTransactions) {
      await updateTransaction(body);
      setOpen(false);
      return;
    }

    await registerTransaction(body);
    setOpen(false);
  }

  return (
    <div className="backdrop" style={{ display: !open && "none" }}>
      {console.log(open)}
      <div className="modal-content modal-storage">
        <img
          className="close-icon"
          src={closeIcon}
          alt="close-icon"
          onClick={() => setOpen(false)}
        ></img>
        <h2>Adicionar registro</h2>
        <div className="container-buttons">
          <button
            className={`btn-empty ${activeButton === "credit" && "btn-credit"}`}
            onClick={() => setActiveButton("credit")}
          >
            Entrada
          </button>
          <button
            className={`btn-empty ${activeButton === "debit" && "btn-debit"}`}
            onClick={() => setActiveButton("debit")}
          >
            Saída
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Valor</label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={(event) => handleChange(event.target)}
            />
          </div>

          <div>
            <label>Categoria</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={(event) => handleChange(event.target)}
            />
          </div>

          <div>
            <label>Data</label>
            <InputMask
              mask="99/99/9999"
              name="date"
              value={form.date}
              onChange={(event) => handleChange(event.target)}
            />
          </div>

          <div>
            <label>Descrição</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={(event) => handleChange(event.target)}
            />
          </div>
          <div className="container-btn-confirm-insert">
            <button className="btn-confirm-insert">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalStorageTransactions;
