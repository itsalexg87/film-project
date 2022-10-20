import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// MUI
import useStyles from "./styles";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { searchMovie } from "../../features/currentGenreOrCategory";

const Search = () => {
  const [query, setQuery] = useState("");
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleKeyPress = (event) => {
    // event.preventDefault();
    if (event.key === "Enter") {
      dispatch(searchMovie(query));
    }
  };

  if (location.pathname !== "/") return null;

  return (
    <div className={classes.searchContainer}>
      <TextField
        variant="standard"
        onKeyPress={handleKeyPress}
        value={query}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default Search;
