import React from "react";
import { Absolute, RelativeContainer, TextField } from "../Global";
import { FaSearch } from "react-icons/fa";
function SearchField() {
  return (
    <RelativeContainer>
      <Absolute left="0.5rem" top="0.7rem">
        <FaSearch style={{color:"#ccc"}} />
      </Absolute>
      <TextField placeholder="Search Tickets" />
    </RelativeContainer>
  );
}

export default SearchField;
