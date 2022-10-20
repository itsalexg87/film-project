import React from "react";
// Components
import { Movie } from "../";
// MUI
import { Grid } from "@mui/material";
import useStyles from "./styles";

const MovieList = ({ movies, numberOfMovies }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.moviesContainer}>
      {movies.results.slice(0, numberOfMovies).map((movie, index) => (
        <Movie movie={movie} key={index} i={index} />
      ))}
    </Grid>
  );
};

export default MovieList;
