import React, { useState } from "react";
import RequestContent from "./RequestContent";
import TabGroup from "../../TabGroup";

const tabItems = ["Query Params", "Headers", "Authorization", "Body"];

const RequestTabGroup: React.FC = () => {
  const [tab, setTab] = useState(0);
  return (
    <>
      <TabGroup tabItems={tabItems} tab={tab} setTab={setTab} name="request" />
      <RequestContent tab={tab} />
    </>
  );
};

export default RequestTabGroup;
