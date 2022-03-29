import "firebase/firestore";

export type Param = {
  key: string;
  value: string;
};

export type ReqAuth = {
  authType: string;
  token: string;
};

export type Folder = {
  id: string;
  name: string;
  order: (string | undefined)[];
};

export type RequestItemType = {
  id?: string;
  auth?: ReqAuth;
  requestName: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  folderId?: string;
  queryParams: Param[];
  headers: Param[];
  doc: string;
  edit?: boolean;
  createdAt?: any;
};

export type ResStatus = {
  status: number;
  time?: any;
  size?: string;
};
export type ResHeader = {
  [key: string]: string;
};
