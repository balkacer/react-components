import "tailwindcss/tailwind.css";
import Select from "./components/Select";
import { generateRandomData } from "./utils/random";

const options = [];

for (let i = 1; i <= 100; i++) {
  options.push({ id: i, ...generateRandomData() });
}

const keys = {
  key: "id",
  label: "fullName",
  value: (item) => item.fullName + " - " + item.email + " - " + item.phone,
};

const selectConfig = {
  options,
  label: "Employee",
  id: "select",
  onChange: (value) => {console.clear(); console.log(value)},
  keys: keys,
  isMulti: true,
  withCheckBox: false,
  defaultSelected: null,
  selectsLimit: 5,
  width: "500px",
  isLoading: false,
  placeholder: "Search...",
  className: "",
  isClearable: true,
  isRequired: false,
  isSearchable: true,
  maxListHeight: "300px",
};

function App() {
  return (
    <div className="flex justify-center items-start h-screen w-screen p-4">
      <Select {...selectConfig} />
    </div>
  );
}

export default App;
