import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { mockData } from "./data/data.js";

// const url ="https://run.mocky.io/v3/69f60a58-3a36-48c5-a9cf-b100b015950c";
const statuses = ['Active', 'Inactive', 'Pending'];
const App = () => {
  // console.log(mockData);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    status: "",
    date: "",
    isVerified: "",
  });


const applyFilters = () => {
  let filtered = mockData;

  // Apply individual column filters
  Object.keys(filters).forEach(key => {
    const filter = filters[key];
    if (filter.value !== '') {
      filtered = filtered.filter(item => {
        switch (filter.condition) {
          case 'equals':
            return item[key].toString() === filter.value;
          case 'contains':
            return item[key].toString().toLowerCase().includes(filter.value.toLowerCase());
          case 'less_than':
            return parseFloat(item[key]) < parseFloat(filter.value);
          case 'less_than_or_equal':
            return parseFloat(item[key]) <= parseFloat(filter.value);
          case 'greater_than':
            return parseFloat(item[key]) > parseFloat(filter.value);
          case 'greater_than_or_equal':
            return parseFloat(item[key]) >= parseFloat(filter.value);
          case 'not_equal':
            return item[key].toString() !== filter.value;
          default:
            return true;
        }
      });
    }
  });

  // Apply search term filter
  if (searchTerm) {
    filtered = filtered.filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  setFilteredData(filtered);
};

useEffect(() => {
  applyFilters();
}, [filters, searchTerm, data]);

const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};

const sortData = (key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });

  const sorted = [...filteredData].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
    return 0;
  });

  setFilteredData(sorted);
};


  // const applyFilters = () => {
  //   let filtered = mockData;

  //   // Apply individual column filters
  //   Object.keys(filters).forEach((key) => {
  //     if (filters[key]) {
  //       filtered = filtered.filter((item) =>
  //         item[key]
  //           .toString()
  //           .toLowerCase()
  //           .includes(filters[key].toLowerCase())
  //       );
  //     }
  //   });

  //   // Apply search term filter
  //   if (searchTerm) {
  //     filtered = filtered.filter((item) =>
  //       Object.values(item).some((val) =>
  //         val.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }

  //   setFilteredData(filtered);
  // };

  // useEffect(() => {
  //   applyFilters();
  // }, [filters, searchTerm, data]);

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // const sortData = (key) => {
  //   let type = "ascending";
  //   if (sortConfig.key === key && sortConfig.type === "ascending") {
  //     type = "descending";
  //   }
  //   setSortConfig({ key, type });

  //   const sorted = [...filteredData].sort((a, b) => {
  //     if (a[key] < b[key]) return type === "ascending" ? -1 : 1;
  //     if (a[key] > b[key]) return type === "ascending" ? 1 : -1;
  //     return 0;
  //   });

  //   setFilteredData(sorted);
  // };

  return (
    <>
      <div>
        {/* <div className="filter-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <input
            type="text"
            placeholder="Filter by ID"
            value={filters.id}
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          
          <input
            type="date"
            placeholder="Filter by Date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by Verified (true/false)"
            value={filters.isVerified}
            onChange={(e) =>
              setFilters({ ...filters, isVerified: e.target.value })
            }
          />
        </div> */}
        <div className="filter-container">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        <input 
          type="number" 
          placeholder="Filter by ID" 
          value={filters.id.value} 
          onChange={(e) => setFilters({ ...filters, id: { ...filters.id, value: e.target.value }})} 
        />
        <select 
          value={filters.id.condition} 
          onChange={(e) => setFilters({ ...filters, id: { ...filters.id, condition: e.target.value }})}>
          <option value="equals">Equals</option>
          <option value="less_than">Less than</option>
          <option value="less_than_or_equal">Less than or equal</option>
          <option value="greater_than">Greater than</option>
          <option value="greater_than_or_equal">Greater than or equal</option>
          <option value="not_equal">Not equal</option>
        </select>

        {/* <input 
          type="text" 
          placeholder="Filter by Name" 
          value={filters.name.value} 
          onChange={(e) => setFilters({ ...filters, name: { ...filters.name, value: e.target.value }})} 
        /> */}
        {/* <select 
          value={filters.name.condition} 
          onChange={(e) => setFilters({ ...filters, name: { ...filters.name, condition: e.target.value }})}>
          <option value="contains">Contains</option>
          <option value="not_contains">Not contains</option>
          <option value="equals">Equals</option>
          <option value="not_equal">Not equal</option>
          <option value="starts_with">Starts with</option>
          <option value="ends_with">Ends with</option>
          <option value="is_null">Is null</option>
          <option value="is_not_null">Is not null</option>
        </select> */}

        

        <input 
          type="date" 
          placeholder="Filter by Date" 
          value={filters.date.value} 
          onChange={(e) => setFilters({ ...filters, date: { ...filters.date, value: e.target.value }})} 
        />
        <select 
          value={filters.date.condition} 
          onChange={(e) => setFilters({ ...filters, date: { ...filters.date, condition: e.target.value }})}>
          <option value="equals">Date is</option>
          <option value="range">Date range</option>
          <option value="less_than">Less than</option>
          <option value="less_than_or_equal">Less than or equal</option>
          <option value="greater_than">Greater than</option>
          <option value="greater_than_or_equal">Greater than or equal</option>
          <option value="not_equal">Not equal</option>
          <option value="is_null">Is null</option>
          <option value="is_not_null">Is not null</option>
        </select>
      </div>
        <table className="min-w-full bg-white border">
          <thead className="cursor-pointer">
            <tr>
            <th onClick={() => sortData('id')}>ID</th>
            <th onClick={() => sortData('name')}>Name</th>
            <th onClick={() => sortData('age')}>Age</th>
            <th onClick={() => sortData('role')}>Role</th>
            <th onClick={() => sortData('hireDate')}>Hire Date</th>
            <th onClick={() => sortData('isActive')}>Active</th>
            <th onClick={() => sortData('salary')}>Salary</th>
            <th onClick={() => sortData('department')}>Department</th>
            <th onClick={() => sortData('projectsCompleted')}>Projects Completed</th>
            <th onClick={() => sortData('lastLogin')}>Last Login</th>
            <th onClick={() => sortData('accessLevel')}>Access Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{employee.id}</td>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.age}</td>
                <td className="py-2 px-4 border-b">{employee.role}</td>
                <td className="py-2 px-4 border-b">{employee.hireDate}</td>
                <td className="py-2 px-4 border-b">
                  {employee.isActive ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">${employee.salary}</td>
                <td className="py-2 px-4 border-b">{employee.department}</td>
                <td className="py-2 px-4 border-b">
                  {employee.projectsCompleted}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(employee.lastLogin).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">{employee.accessLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
