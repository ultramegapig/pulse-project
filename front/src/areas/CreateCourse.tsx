import React, { useState } from "react";
import Select, { components, MultiValue } from "react-select";


interface Option {
  value: string;
  label: string;
}

// Пример списка опций для выбора
const options: Option[] = [
  { value: "МПБ-201-О-01", label: "МПБ-201-О-01" },
  { value: "МПБ-202-О-02", label: "МПБ-202-О-02" },
  
];


const MultiValueLabel = (props: any) => (
  <components.MultiValueLabel {...props}>
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "2px 5px",
      }}
    >
      {props.data.label}
    </div>
  </components.MultiValueLabel>
);

const CreateCourse: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleChange = (selected: MultiValue<Option>) => {
    
    setSelectedOptions(
      selected.map((option) => ({ value: option.value, label: option.label }))
    );
  };


  const [courseName, setCourseName] = useState('');
  const handleChangeCourseName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setCourseName(event.target.value);
};

const [description, setDescription] = useState('');
  const handleDescription = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setDescription(event.target.value);
};

const [syllabus, setSyllabus] = useState('');
  const handleSyllabus = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSyllabus(event.target.value);
};

const [volume, setVolume] = useState('');
  const handleVolume = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setVolume(event.target.value);
};

  return (
    <div>
      <h1>Создайте новый курс</h1>
      <div className="createLecture-topic">
        <label htmlFor="textInput">Название курса</label>
        <input
          id="textInput"
          type="text"
          value={courseName}
          onChange={handleChangeCourseName}
          placeholder="Введите название курса"
        />
      </div>

      <div className="createLecture-topic">
        <label htmlFor="textInput">Описание</label>
        <input
          id="textInput"
          type="text"
          value={description}
          onChange={handleDescription}
          placeholder="Введите краткое описание курса"
        />
      </div>

      <div className="createLecture-topic">
        <label htmlFor="textInput">Ученый план</label>
        <input
          id="textInput"
          type="text"
          value={syllabus}
          onChange={handleSyllabus}
          placeholder="Вставьте ссылку на учебный план"
        />
      </div>

      <div className="createLecture-topic">
  <label htmlFor="textInput">Количество лекций</label>
  <input
    id="textInput"
    type="number"
    value={volume}
    onChange={handleVolume}
    placeholder="Вставьте количество лекций"
    min="1"
    step="1"
  />
</div>

      <Select
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        components={{ MultiValueLabel }}
        styles={{
          control: (provided) => ({
            ...provided,
            borderColor: "#ccccff",
            borderRadius: "12px",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#aaaaee",
            },
          }),
          multiValue: (styles) => ({
            ...styles,
            backgroundColor: "#f0f0ff",
          }),
        }}
      />
    </div>
  );
};

export default CreateCourse;
