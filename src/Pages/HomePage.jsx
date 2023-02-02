import { useState, useContext, useEffect } from "react";
import DataTable from "../Components/DataTable";
import { useMemo } from "react";
import { DateRangePicker } from "rsuite";
import TableCell from "../Components/TableCell";
import { createColumnHelper } from "@tanstack/react-table";
import { Context } from "../Components/Context";
const HomePage = () => {
  const columnHelper = createColumnHelper();
  const { fetchData } = useContext(Context);
  const [tableData, setTableData] = useState({ maxPages: 0, data: [] });
  const [filterList, setFilterList] = useState([]);
  const allColumns = useMemo(() => {
    let columnList = [];
    if (tableData.data.length > 0) {
      columnList = Object.keys(tableData.data[0]).map((x) => ({
        column: columnHelper.accessor(x, {
          cell: TableCell,
          header: x,
        }),
        name: x,
      }));
      if (filterList.length === 0) {
        setFilterList(columnList.map((x) => x.name));
      }
    }
    return columnList;
  }, [tableData.data]);

  const [selectedCount, setSelectedCount] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const getNewResults = () => {
    setLoadingMessages(true);
    setTimeout(() => {
      setLoadingMessages(false);
    }, 2000);
  };
  const { pageStart, pageEnd, maxPages } = useMemo(() => {
    return {
      pageStart: (pageIndex - 1) * selectedCount,
      pageEnd: (pageIndex - 1) * selectedCount + selectedCount,
      maxPages: Math.ceil(tableData.maxCount / selectedCount),
    };
  }, [pageIndex, selectedCount, tableData.data]);
  const columns = useMemo(
    () =>
      allColumns
        .filter((x) => filterList.includes(x.name))
        .map((x) => x.column),
    [filterList]
  );
  const data = useMemo(() => {
    const arrToReturn = tableData.data.filter((x) =>
      JSON.stringify(x?.albumId)
        ?.toLowerCase()
        ?.includes(searchFilter.toLowerCase())
    );
    return arrToReturn;
  }, [searchFilter, pageIndex, tableData.data]);

  const updateData = () => {
    if (loadingMessages) {
      return;
    }
    setLoadingMessages(true);
    fetchData({ searchFilter, pageIndex, perPage: selectedCount }).then(
      (res) => {
        setTableData(res);
        setLoadingMessages(false);
      }
    );
  };
  useEffect(() => {
    if (searchFilter === "" || data.length === 0) {
      updateData();
    }
  }, [selectedCount, searchFilter]);
  useEffect(() => {
    updateData();
  }, [pageIndex]);
  return (
    <div className="list-container">
      <div className="first-row">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setPageIndex(1);
            }}
          />
        </div>
        <div className="date-picker">
          <DateRangePicker format="DD/MM/YYYY" />
        </div>
        <div className="select">
          <div className="show-manage-column">Manage Columns</div>
          <div className="manage-column">
            {allColumns.map((x, i) => (
              <div key={x.name} className="flex">
                <label htmlFor={x.name}>
                  <span>{x.name}</span>
                  <input
                    id={x.name}
                    onChange={() => {
                      if (filterList.includes(x.name)) {
                        setFilterList((prevValue) => {
                          const index = prevValue.findIndex(
                            (item) => item === x.name
                          );
                          const arrToReturn = [...prevValue];
                          arrToReturn.splice(index, 1);
                          return [...arrToReturn];
                        });
                        return;
                      }
                      setFilterList((prevValue) => [...prevValue, x.name]);
                    }}
                    type="checkbox"
                    checked={filterList.includes(x.name)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="drop-down-for-entries">
          <div className="show-entries-list">Show entries</div>
          <div className="entries-list">
            {[10, 25, 50].map((x) => {
              return (
                <div
                  key={x}
                  onClick={() => {
                    setSelectedCount(x);
                    setPageIndex(1);
                  }}
                  className={`${selectedCount === x ? "active" : ""}`}
                >
                  {x}
                </div>
              );
            })}
          </div>
        </div>
        {loadingMessages && <div className="loading-message"></div>}
      </div>
      <div className="">
        <DataTable
          enablePagination
          pageIndex={pageIndex}
          maxPages={maxPages}
          setPageIndex={setPageIndex}
          columns={columns}
          data={data ?? []}
        />
      </div>
    </div>
  );
};
export default HomePage;
