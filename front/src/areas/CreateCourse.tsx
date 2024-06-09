import React, { useState } from 'react';
import Select, { components, MultiValue } from 'react-select';

// Определите интерфейс для опций
interface Option {
  value: string;
  label: string;
}

// Пример списка опций для выбора
const options: Option[] = [
  { value: 'МПБ-201-О-01', label: 'МПБ-201-О-01' },
  { value: 'МПБ-202-О-02', label: 'МПБ-202-О-02' },
  // Добавьте другие варианты здесь
];

// Кастомный компонент для MultiValueLabel (рамка для выбранных значений)
const MultiValueLabel = (props: any) => (
  <components.MultiValueLabel {...props}>
    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 5px' }}>
      {props.data.label}
    </div>
  </components.MultiValueLabel>
);

const CreateCourse: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleChange = (selected: MultiValue<Option>) => {
    // Мы должны сохранить в состоянии массив объектов типа Option, а не только значения
    setSelectedOptions(selected.map(option => ({ value: option.value, label: option.label })));
  };

  return (
    <Select
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      options={options}
      components={{ MultiValueLabel }}
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: '#ccccff',
          borderRadius: '12px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#aaaaee',
          },
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: '#f0f0ff',
        }),
      }}
    />
  );
};

export default CreateCourse;
