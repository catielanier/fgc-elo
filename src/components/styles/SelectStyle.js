const SelectStyle = {
  control: (provided, state) => ({
    ...provided,
    border: "0",
    borderRadius: "3px",
    borderBottom:
      state.isSelected || state.isFocused
        ? "2px solid #b3cde0"
        : "2px solid #e9a7c6",
    fontFamily: `"Dosis", sans-serif`,
    marginBottom: "20px"
  })
};

export default SelectStyle;
