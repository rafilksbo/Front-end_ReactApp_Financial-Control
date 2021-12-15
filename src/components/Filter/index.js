import "./styles.css";
import filterIcon from "../../assets/filter.svg";
import { useState, useEffect } from "react";
import Chip from "../Chip";
import defaultWeekDays from "./defaultWeekDays";
import { getOnlySelectedWeekDays, getOnlySelectedCategories, populatedAndMergeNewAndOldCategs } from "./utils";
import { max } from "date-fns";
import { id } from "date-fns/locale";

function Filters({ transactions, handleOrderTransactions, reload, setReload }) {
  const [open, setOpen] = useState(false);
  const [weekDays, setWeekDays] = useState(defaultWeekDays);
  const [categories, setCategories] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [transactionsInFilter, setTransactionsInFilter] = useState([]);

  useEffect(() => {
    populatedCategoriesInFilter()
  }, [transactions]);

  useEffect(() => {
    loadTransactionsInFilter();
  }, [transactions]);

  function populatedCategoriesInFilter(){
   const allCategories = populatedAndMergeNewAndOldCategs(transactionsInFilter, categories)
   setCategories(allCategories)
    //const allCategories = [];

    // for (const transact of transactionsInFilter) {
    //   allCategories.push({
    //     name: transact.category,
    //     selected: false,
    //   });
    // }

    // const categsId = [];
    // const categoriesWithoutDupplicatedItems = [];

    // for (const categ of allCategories) {
    //   if (categsId.indexOf(categ.name) === -1) {
    //     categsId.push(categ.name);
    //     categoriesWithoutDupplicatedItems.push(categ);
    //   }
    // }

    //setCategories(categoriesWithoutDupplicatedItems);
  }

  async function loadTransactionsInFilter() {
    const response = await fetch("http://localhost:3333/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setTransactionsInFilter(data);
  }

  function handleSelectedWeekDayFilter(weekDay) {
    const localWeekDay = [...weekDays];

    const day = localWeekDay.find((day) => day.name === weekDay);

    day.selected = !day.selected;

    setWeekDays(localWeekDay);
  }

  function handleSelectedCategFilter(categ) {
    const localCategs = [...categories];

    const category = localCategs.find((category) => category.name === categ);

    category.selected = !category.selected;

    setCategories(localCategs);
  }

  function handleClearFilter() {
    const localWeekDay = [...weekDays];

    for (const day of localWeekDay) {
      day.selected = false;
    }
    setWeekDays(defaultWeekDays);

    const localCategs = [...categories];

    for (const categ of localCategs) {
      categ.selected = false;
    }

    setCategories(localCategs);
    setMaxValue(0);
    setMinValue(0);

    setReload(!reload);
  }

  function handleApllyFilters() {
    const selectedDays = getOnlySelectedWeekDays(weekDays);
    const selectedCategs = getOnlySelectedCategories(categories);

    if(!selectedDays.length && !selectedCategs.length && !minValue && !maxValue){ 
      //!selectedDays.length && !selectedCategs.length significa .length === 0
      //!minValue && !maxValue significa === 0
      setReload(!reload)
      return
    }

    const transactionsFilterByValue = [];

    const localTransactions = [...transactionsInFilter];
    if (selectedDays.length === 0 && selectedCategs.length === 0) {
      for (const transact of localTransactions) {
        if (minValue && Number(transact.value) < minValue) {
          continue;
        }

        if (maxValue && Number(transact.value) > maxValue) {
          continue;
        }

        if (minValue && minValue <= Number(transact.value)) {
          transactionsFilterByValue.push(transact);
        }

        if (maxValue && maxValue >= Number(transact.value)) {
          transactionsFilterByValue.push(transact);
        }
        console.log(transactionsFilterByValue);
      }

      const idTransactions = [];
      const transactionsRemoveDupplicateds = [];

      for (const transact of transactionsFilterByValue) {
        if (idTransactions.indexOf(transact.id) === -1) {
          idTransactions.push(transact.id);
          transactionsRemoveDupplicateds.push(transact);
        }
      }
      handleOrderTransactions(transactionsRemoveDupplicateds);

      return 

    }

    const filteredTransactions = []

    for(const transact of localTransactions){
      if (minValue && Number(transact.value) < minValue) {
          continue;
        }

        if (maxValue && Number(transact.value) > maxValue) {
          continue;
        }

        if(selectedDays.length > 0 && selectedCategs.length > 0){
          if(selectedDays.includes(transact.week_day.toLowerCase())
          &&  selectedCategs.includes(transact.category.toLowerCase())){
            filteredTransactions.push(transact)
          }
          continue
        }
        if(selectedDays.length > 0 && selectedDays.includes(transact.week_day.toLowerCase())){
          filteredTransactions.push(transact)
          continue
        }

        if(selectedCategs.length > 0 && selectedCategs.includes(transact.category.toLowerCase())){
          filteredTransactions.push(transact)
          continue
        }
    }

    const transactIfAux = []
    const transactionsWithoutDupplicates = []

    for(const transact of filteredTransactions){
      if(transactIfAux.indexOf(transact.id)===-1){
        transactIfAux.push(transact.id);
        transactionsWithoutDupplicates.push(transact)
      }
    }

    handleOrderTransactions(transactionsWithoutDupplicates)

  }

  return (
    <div className="container-filters">
      <button className="btn-filter" onClick={() => setOpen(!open)}>
        <img src={filterIcon} alt="filters"></img>
        <strong>Filtrar</strong>
      </button>
      {open && (
        <div className="content-filters">
          <div className="items-filter">
            <strong>Dia da semana</strong>
            <div className="container-chips">
              {weekDays.map((day) => (
                <Chip
                  key={day.name}
                  title={day.name}
                  selected={day.selected}
                  handleSelectedChip={handleSelectedWeekDayFilter}
                />
              ))}
            </div>
          </div>
          <div className="separator"></div>
          <div className="items-filter">
            <strong>Categoria</strong>
            <div className="container-chips">
              {categories.map((categ) => (
                <Chip
                  key={categ.name}
                  title={categ.name}
                  selected={categ.selected}
                  handleSelectedChip={handleSelectedCategFilter}
                />
              ))}
            </div>
          </div>
          <div className="separator"></div>

          <div className="items-filter">
            <strong>Valor</strong>
            <div className="container-input-filter">
              <label>Min.</label>
              <input
                type="number"
                value={minValue}
                onChange={(event) => setMinValue(event.target.valueAsNumber)}
              ></input>
            </div>
            <div className="container-input-filter">
              <label>Max.</label>
              <input
                type="number"
                value={maxValue}
                onChange={(event) => setMaxValue(event.target.valueAsNumber)}
              ></input>
            </div>
          </div>
          <div className="container-action-buttons">
            <button
              className="btn-clear-filters"
              onClick={() => handleClearFilter()}
            >
              Limpar Filtros
            </button>
            <button
              className="btn-apply-filters"
              onClick={() => handleApllyFilters()}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters;
