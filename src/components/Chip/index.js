import "./styles.css";
import addIcon from "../../assets/add-icon.svg";
import removeIcon from "../../assets/remove-icon.svg";

function Chip({ title, selected, handleSelectedChip }) {
  return (
    <div
      className={`container-chip ${selected && "selected-chip"}`}
      onClick={() => handleSelectedChip(title)}
    >
      <span>{title}</span>
      <img
        className="icon-chip"
        src={selected ? removeIcon : addIcon}
        alt="icon-chip"
      ></img>
    </div>
  );
}

export default Chip;
