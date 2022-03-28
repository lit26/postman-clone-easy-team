import React, { useState } from "react";
import ResponseContent from "./ResponseContent";
import TabGroup from "../../TabGroup";

const tabItems = ["Body", "Headers"];

const ResponseTabGroup: React.FC = () => {
  const [tab, setTab] = useState(0);
  return (
    <>
      <TabGroup tabItems={tabItems} tab={tab} setTab={setTab} name="response" />
      <ResponseContent tab={tab} />
    </>
  );
};

export default ResponseTabGroup;
