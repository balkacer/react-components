import "tailwindcss/tailwind.css";
import Select from "./components/Select";

const options = [
  { id: 1, age: 23, isMale: true, name: "Enmanuel" },
  { id: 2, age: 20, isMale: true, name: "Juan" },
  { id: 3, age: 25, isMale: false, name: "Jasmine" },
  { id: 4, age: 21, isMale: false, name: "Maria" },
  { id: 5, age: 14, isMale: true, name: "Tomas" },
  { id: 6, age: 21, isMale: true, name: "Miguel" },
  { id: 7, age: 42, isMale: true, name: "Carlos" },
  { id: 8, age: 30, isMale: false, name: "Rosy" },
];

const keys = {
  key: "id",
  label: "name",
  value: (item) => item.name + " is " + item.age + " years old",
};

const selectConfig = {
  options,
  label: "Employee",
  id: "select",
  onChange: (value) => console.log(value),
  keys: keys,
  isMulti: true,
  withCheckBox: true,
  setSelected: options[2],
  selectsLimit: 3,
  width: "300px",
};

function App() {
  return (
    <div className="flex justify-center items-start h-screen w-screen p-4">
      <Select {...selectConfig} />
    </div>
  );
}

export default App;
