import axios from "axios";
import { createContext, useState } from "react";
export const Context = createContext();

const Contexts = ({ children }) => {
  async function fetchData({ pageIndex, searchFilter, perPage }) {
    let params = {
      _start: (pageIndex - 1) * perPage,
      _limit: perPage,
    };
    if (searchFilter !== "") {
      params.albumId = searchFilter;
    }
    const ab = await axios
      .get("http://jsonplaceholder.typicode.com/photos", {
        params,
      })
      .then((res) => ({ maxCount: 50, data: res.data }));
    return ab;
  }
  return <Context.Provider value={{ fetchData }}>{children}</Context.Provider>;
};

export default Contexts;
