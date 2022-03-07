import * as React from "react";
import { Header } from "../../common/header/Header";
import "./Home.css";
import { moviesInfo } from "../../common/moviesData";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import CardHeader from "@mui/material/CardHeader";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { genress } from "../../common/genre";
import { artistss } from "../../common/artists";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const flexContainer = {
  flexWrap: "nowrap",
  transform: "translateZ(0)",
};

const styles = (theme) => ({
  colorClass: {
    color: theme.palette.primary.light,
  },
  marginClass: {
    margin: theme.spacing(1),
  },
  darkClass: {
    color: theme.palette.primary.dark,
  },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Home = (props) => {
  const [releasedMovies, setReleasedMovies] = useState([]);
  const [publishedMovies, setPublishedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [artistName, setArtistName] = useState([]);
  const [genreName, setGenreName] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [releaseEndDate, setReleaseEndDate] = useState("");
  const [releaseStartDate, setReleaseStartDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:8085/artists", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setArtists(response.artists);
      });

    fetch("http://localhost:8085/genres", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setGenres(response.genres);
      });
    fetch("http://localhost:8085/api/movies?status=PUBLISHED", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setPublishedMovies(response.movies);
      });
    fetch("http://localhost:8085/api/movies?status=RELEASED", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setReleasedMovies(response.movies);
      });
  }, []);

  const genreHandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGenreName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const artistHandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setArtistName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const applyButtonHandler = () => {
    let url = "http://localhost:8085/api/movies?status=RELEASED";
    if (movieName !== "") {
      url += "&title=" + movieName;
    }
    if (genreName.length > 0) {
      url += "&genres=" + genreName.toString();
    }
    if (artistName.length > 0) {
      url += "&artists=" + artistName.toString();
    }
    if (releaseStartDate !== "") {
      url += "&start_date=" + releaseStartDate;
    }
    if (releaseEndDate !== "") {
      url += "&end_date=" + releaseEndDate;
    }
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setReleasedMovies(response.movies);
      });
  };

  const { classes } = props;
  return (
    <div>
      <Header pageName="Home" />
      <span className="heading">Upcoming Movies</span>
      <ImageList style={flexContainer} cols={6} rowHeight={250}>
        {publishedMovies.map((item) => (
          <ImageListItem className="imageListItem" key={item.id}>
            <Link to={{ pathname: `/details/${item.id}` }}>
              <img src={item.poster_url} alt="movie" />
            </Link>
            <ImageListItemBar title={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
      <div className="flex-container">
        <div className="left">
          <ImageList cols={4} rowHeight={350} gap={20}>
            {releasedMovies.map((item) => (
              <ImageListItem key={item.id}>
                <Link to={{ pathname: `/details/${item.id}` }}>
                  <img src={item.poster_url} alt="movie" />
                </Link>
                <ImageListItemBar
                  title={item.title}
                  subtitle={
                    "Release Date:" +
                    new Date(item.release_date)
                      .toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      .replaceAll(",", "")
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
        <div className="right">
          <Card
            sx={{
              minWidth: 240,
              maxWidth: 300,
              classes: classes.marginClass,
              width: 280,
            }}
          >
            <CardContent>
              <CardHeader
                title="FIND MOVIES BY:"
                className={classes.colorClass}
              />
              <FormControl margin="dense" sx={{ width: 230 }}>
                <TextField
                  id="standard-basic"
                  label="Movie Name"
                  variant="standard"
                  value={movieName}
                  onChange={(e) => {
                    setMovieName(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ width: 230 }}
                margin="dense"
              >
                <InputLabel>Genres</InputLabel>
                <Select
                  multiple
                  value={genreName}
                  onChange={genreHandleChange}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {genres.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      <Checkbox checked={genreName.indexOf(item.name) > -1} />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ width: 230 }}
                margin="dense"
              >
                <InputLabel>Artists</InputLabel>
                <Select
                  multiple
                  value={artistName}
                  onChange={artistHandleChange}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {artists.map((item) => {
                    let artistFullName = item.first_name + " " + item.last_name;
                    return (
                      <MenuItem key={artistFullName} value={artistFullName}>
                        <Checkbox
                          checked={artistName.indexOf(artistFullName) > -1}
                        />
                        <ListItemText primary={artistFullName} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl margin="normal">
                <TextField
                  variant="standard"
                  id="date"
                  label="Release Date Start"
                  type="date"
                  sx={{ width: 230 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={releaseStartDate}
                  onChange={(e) => {
                    setReleaseStartDate(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl margin="normal">
                <TextField
                  variant="standard"
                  id="date"
                  label="Release End Start"
                  type="date"
                  sx={{ width: 230 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={releaseEndDate}
                  onChange={(e) => {
                    setReleaseEndDate(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <Button
                  onClick={applyButtonHandler}
                  sx={{
                    classes: classes.darkClass,
                    width: 230,
                    textAlign: "center",
                  }}
                  variant="contained"
                >
                  APPLY
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default withStyles(styles)(Home);
