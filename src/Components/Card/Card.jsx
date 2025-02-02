import React, { useState } from "react";
import { IoMdCheckboxOutline, IoMdClock, IoMdMore } from "react-icons/io";
import Dropdown from "../Dropdown/Dropdown";
import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { id, title, date, tasks, labels } = props.card;

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Aprl",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      )}
      <div
        className="card"
        draggable
        onDragEnd={() => props.dragEnded(props.boardId, id)}
        onDragEnter={() => props.dragEntered(props.boardId, id)}
        onClick={() => setShowModal(true)}
      >
        <div className="card_top">
          <div className="card_top_labels">
            {labels?.map((item, index) => (
              <label key={index} style={{ backgroundColor: item.color }}>
                {item.text}
              </label>
            ))}
          </div>
          <div className="card_top_more"
            onClick={(event) => {
              event.stopPropagation();
              setShowDropdown((prev) => !prev);
            }}
          >
            <IoMdMore />
            {showDropdown && (
              <Dropdown
                className="board_dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <p onClick={() => props.removeCard(props.boardId, id)}>
                  Delete Card
                </p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card_title">{title}</div>
        <div className="card_footer">
          {date && (
            <p className="card_footer_item">
              <IoMdClock className="card_footer_icon" />
              {formatDate(date)}
            </p>
          )}
          {tasks?.length > 0 && (
            <p className="card_footer_item">
              <IoMdCheckboxOutline className="card_footer_icon" />
              {tasks.filter((item) => item.completed).length}/{tasks.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
