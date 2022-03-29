import React from "react";
import { RequestItemType } from "../../../../types/data";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import RequestItem from "../../RequestItem";
import { useApi } from "../../../../context/ApiContext";
import { arrayMoveImmutable } from "array-move";

interface FolderItemsProps {
  items: RequestItemType[];
}

const SortableItem = SortableElement(({ item }: { item: any }) => (
  <RequestItem
    // key={`requestItem_${index}`}
    requestItem={item}
  />
));
const SortableList = SortableContainer(
  ({ items }: { items: RequestItemType[] }) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} item={value} />
        ))}
      </div>
    );
  }
);

const FolderItems: React.FC<FolderItemsProps> = ({ items }) => {
  const { updateRequestItemOrder } = useApi();
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const folderId = items.length > 0 ? items[0].folderId : undefined;
    const sortedIds = arrayMoveImmutable(
      items.map((item) => item.id),
      oldIndex,
      newIndex
    );
    if (folderId && sortedIds) {
      updateRequestItemOrder(folderId, sortedIds);
    }
  };
  return <SortableList items={items} onSortEnd={onSortEnd} pressDelay={200} />;
};

export default FolderItems;
