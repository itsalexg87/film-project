import React, { useState, useEffect } from "react";
import axios from "axios";
import { MovieList } from "../";
import { Link, useParams } from "react-router-dom";
import genreIcons from "../../assets/genres";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery } from "../../services/TMDB";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { userSelector } from "../../features/auth";
// MUI
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from "@mui/icons-material";
import useStyles from "./styles";

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const { data, isFetching, error } = useGetMovieQuery({ id });
  const { data: favoriteMovies } = useGetListQuery({
    listName: "favorite/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });
  const { data: watchlistMovies } = useGetListQuery({
    listName: "watchlist/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: recommendations, isFetching: isFetchingRecommendations } = useGetRecommendationsQuery({
    list: "/recommendations",
    movieId: id,
  });

  useEffect(() => {
    setIsFavorite(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsWatchlist(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMBD_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        favorite: !isFavorite,
      }
    );
    setIsFavorite((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMBD_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        watchlist: !isWatchlist,
      }
    );
    setIsWatchlist((prev) => !prev);
  };

  if (isFetching) {
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size="8rem" />
    </Box>;
  }

  if (error) {
    <Box display="flex" justifyContent="center" alignItems="center">
      <Link to="/">Something has gone wrong - Go back</Link>
    </Box>;
  }

  console.log(isFavorite, "favorite");
  console.log(isWatchlist, "watchlist");

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} align="center">
        <img
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
          className={classes.poster}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data?.release_date.split("-")[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data?.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: "10px" }}>
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime} min {`| ${data?.spoken_languages[0].name}`}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
            <Link
              to={`/`}
              className={classes.links}
              onClick={() => dispatch(selectGenreOrCategory(genre?.id))}
              key={genre?.name}>
              <img src={genreIcons[genre?.name.toLowerCase()]} className={classes.genreImage} height="30" />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: "2rem" }}>{data?.overview}</Typography>
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data &&
            data?.credits?.cast
              ?.map(
                (character, index) =>
                  character?.profile_path && (
                    <Grid
                      item
                      key={index}
                      xs={4}
                      md={2}
                      component={Link}
                      to={`/actors/${character.id}`}
                      style={{ textDecoration: "none" }}>
                      <img
                        className={classes.castImage}
                        src={`https://image.tmdb.org/t/p/w500/${character?.profile_path}`}
                        alt={character?.name}
                      />
                      <Typography color="textPrimary">{character?.name}</Typography>
                      <Typography color="textSecondary" variant="body2">
                        {character?.character?.split("/")[0]}
                      </Typography>
                    </Grid>
                  )
              )
              .slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: "2rem" }}>
          <div className={classes.buttonsContainer}>
            {/* <Grid item xs={12} sm={6}> */}
            <ButtonGroup size="medium" variant="outlined" className={classes.buttonContainerOne}>
              <Button target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>
                Website
              </Button>
              <Button
                target="_blank"
                rel="noopener noreferrer"
                href={`https://imdb.com/title/${data?.imdb_id}`}
                endIcon={<MovieIcon />}>
                IMDB
              </Button>
              <Button href="#" onClick={() => setOpen(true)} endIcon={<Theaters />}>
                Trailer
              </Button>
            </ButtonGroup>
            {/* </Grid> */}
            {/* <Grid item xs={12} sm={6} > */}
            <ButtonGroup size="medium" variant="outlined" className={classes.buttonContainerTwo}>
              <Button onClick={addToFavorites} endIcon={isFavorite ? <Favorite /> : <FavoriteBorderOutlined />}>
                {isFavorite ? "Unfavorite" : "Favorite"}
              </Button>
              <Button onClick={addToWatchlist} endIcon={isWatchlist ? <Remove /> : <PlusOne />}>
                Watchlist
              </Button>
              <Button endIcon={<ArrowBack />} sx={{ borderColor: "primary.main" }}>
                <Typography
                  component={Link}
                  to="/"
                  color="inherit"
                  variant="subtitle2"
                  style={{ textDecoration: "none" }}>
                  Back
                </Typography>
              </Button>
            </ButtonGroup>
            {/* </Grid> */}
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {recommendations ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box>Sorry nothing was found ...</Box>
        )}
      </Box>
      {data?.videos?.results?.length > 0 && (
        <Modal closeAfterTransition className={classes.modal} open={open} onClose={() => setOpen(false)}>
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
            allowFullScreen
          />
        </Modal>
      )}
    </Grid>
  );
};

export default MovieInformation;
