import styled from "@emotion/styled";
import { Checkbox } from "@twilio-paste/core";
import { Flex } from "@twilio-paste/core/Flex";
import { Box } from "@twilio-paste/core/box";
import { DragIcon } from "@twilio-paste/icons/cjs/DragIcon";
import React, { useRef, useState } from "react";

const MetricList = styled.ol`
  width: 100%;
  list-style: none;
  & > li + li {
    margin-top: 8px;
  }
  & > div + div {
    margin-top: 8px;
  }
`;

const ListItem = styled.li`
  border: 1px solid #cacdd8;
  border-radius: 2px;
  cursor: move;
`;

const Container = styled(Box)`
  width: 400px;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
`;

const initItems = [
  {
    id: "waiting",
    text: "Waiting",
  },
  {
    id: "avail",
    text: "Availaible",
  },
  {
    id: "longest",
    text: "Longest wait",
  },
  {
    id: "sla",
    text: "SLA - Last 30m",
  },
];

interface CheckboxState {
  [key: string]: boolean;
}

const SortableListScratch = () => {
  const dragSrc = useRef<HTMLElement | null>(null);

  const [items, setItems] = useState(initItems);

  const initCheckboxes = () => {
    const checkboxesState: CheckboxState = {};
    items.forEach((item: { id: string }) => {
      checkboxesState[item.id] = false;
    });

    return checkboxesState;
  };

  const [checkedItems, setCheckedItems] = useState(initCheckboxes);

  const isItemSelected = (id: string) => checkedItems[id];
  const onCheckboxClick = (id: string) => {
    debugger; // execution will pause here
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDragStart = (
    sourceEvent: React.DragEvent<HTMLElement>,
    sourceId: string
  ) => {
    sourceEvent.dataTransfer.effectAllowed = "move";
    sourceEvent.dataTransfer.setData("text/plain", sourceId);

    // To be used throughout the lifecycle
    dragSrc.current = sourceEvent.currentTarget;

    sourceEvent.currentTarget.classList.add("dragElem");
  };

  const handleDragEnter = () => {};

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    console.log("Drag Over", e.currentTarget.innerText, dragSrc.current.innerText, e.currentTarget === dragSrc.current);
    e.preventDefault();

    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
    e.dataTransfer.dropEffect = "move";

    e.currentTarget !== dragSrc.current  && e.currentTarget.classList.add("over");

    return false;
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    // console.log("Drag Leave", e.currentTarget.innerText);
    e.currentTarget.classList.remove("over");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLElement>,
    droppedElementId: string
  ) => {
    const draggedItemId = e.dataTransfer.getData("text/plain");
    if (droppedElementId === draggedItemId) {
      return false;
    }

    const originalItem = items.find((item) => item.id === droppedElementId);
    const originalItemIndex = items.findIndex(
      (item) => item.id === droppedElementId
    );
    const newItem = items.find((item) => item.id === draggedItemId);
    const newItemIndex = items.findIndex((item) => item.id === draggedItemId);

    const newItems = [...items];

    if (originalItem && newItem) {
      newItems[originalItemIndex] = newItem;
      newItems[newItemIndex] = originalItem;
    }

    setItems(newItems);
    e.currentTarget.classList.remove("over");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLElement>) => {
    // console.log("Drag End", e.currentTarget.innerText);
    e.currentTarget.classList.remove("over");
    e.currentTarget.classList.remove("dragElem");
  };

  return (
    <>
      <Container>
        <h1>from scratch</h1>
        <MetricList id="columns">
          {items.map((item) => {
            return (
              <ListItem
                draggable="true"
                className="column"
                key={item.id}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
              >
                <Flex padding={"space30"} hAlignContent="between">
                  <Checkbox
                    checked={isItemSelected(item.id)}
                    onChange={() => {
                      onCheckboxClick(item.id);
                    }}
                  >
                    {item.text}
                  </Checkbox>
                  <DragIcon decorative={false} title="Reorder" />
                </Flex>
              </ListItem>
            );
          })}
        </MetricList>
      </Container>
    </>
  );
};

export default SortableListScratch;
