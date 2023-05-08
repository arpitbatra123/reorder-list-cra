import { Box } from "@twilio-paste/core/box";
import { Flex } from "@twilio-paste/core/Flex";
import { Checkbox } from "@twilio-paste/core";
import styled from "@emotion/styled";
import { DragIcon } from "@twilio-paste/icons/cjs/DragIcon";
import React, { useState } from "react";
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  // arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableListItem";

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

const SortableListLibrary = () => {
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
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    debugger;
    if (over && active.id !== over?.id) {
      // setItems((items) => {
      //   const oldIndex = items.indexOf(active.id);
      //   const newIndex = items.indexOf(over.id);

      //   return arrayMove(items, oldIndex, newIndex);
      // });

      const originalItem = items.find((item) => item.id === over.id);
      const originalItemIndex = items.findIndex((item) => item.id === over.id);
      const newItem = items.find((item) => item.id === active.id);
      const newItemIndex = items.findIndex((item) => item.id === active.id);

      const newItems = [...items];

      if (originalItem && newItem) {
        newItems[originalItemIndex] = newItem;
        newItems[newItemIndex] = originalItem;
      }

      setItems(newItems);
    }
  };

  return (
    <>
      <Container>
        <h1>@dnd-kit/sortable</h1>
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <MetricList id="columns">
              {items.map((item) => (
                <SortableItem key={`${item.id}-sort`} id={item.id}>
                  <ListItem>
                    <Flex padding={"space30"} hAlignContent="between">
                      <Checkbox
                        checked={isItemSelected(item.id)}
                        onChange={() => {
                          onCheckboxClick(item.id);
                        }}
                        key={`${item.id}-checkbox`}
                      >
                        {item.text}
                      </Checkbox>
                      <DragIcon decorative={false} title="Reorder" />
                    </Flex>
                  </ListItem>
                </SortableItem>
              ))}
            </MetricList>
          </SortableContext>
        </DndContext>
      </Container>
    </>
  );
};

export default SortableListLibrary;
