import * as React from 'react'
import { Header } from '../../common/header/Header'
import { styled } from '@mui/material/styles';
import "./Details.css";
import { moviesInfo as moviesData } from "../../common/moviesData";
import { Link, useParams } from "react-router-dom";
import { useState } from 'react';
import { Typography } from '@mui/material';
import YouTube from 'react-youtube';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Rating from '@mui/material/Rating';
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0.5),
    textTransform: 'none',
}));

export function Details(props) {
    let { movieId } = useParams();
    let [movie, setMovie] = useState();
    
    React.useContext(()=>{
        fetch(`http://localhost:8085/api/movies/${movieId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setMovie(response[0]);
      });
    },[])

    return (
        <div>
            <Header pageName="Details" movieId = {movieId}/>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}><Div className='backButton'>{"< Back to Home"}</Div></Link>
            <section className='bodySection'>
                <article className='first'>
                    <img className="movieImage" src={movie.poster_url} alt='movie' />
                </article>
                <article className='second'>
                    <Typography style={{ textAlign: "inherit", marginBottom: "15px"}} variant="headline" component="h2">{movie.title}</Typography>
                    <Typography style={{ textAlign: "inherit" }} ><strong>Genres:</strong> {movie.genres.join(', ')}</Typography>
                    <Typography style={{ textAlign: "inherit" }} ><strong>Duration:</strong> {movie.duration}</Typography>
                    <Typography style={{ textAlign: "inherit" }} ><strong>Release Date:</strong> {new Date(movie.release_date)
                        .toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })
                        .replaceAll(",", "")}</Typography>
                    <Typography style={{ textAlign: "inherit" }}><strong>Rating:</strong> {movie.critics_rating}</Typography>
                    <Typography style={{ marginTop: "16px", textAlign: "inherit" }}><strong>Plot:</strong> (<a href={movie.wiki_url}>Wiki link</a>) {movie.storyline}</Typography>
                    <Typography style={{ marginTop: "16px", textAlign: "inherit" }}><strong>Trailer:</strong></Typography>
                    <YouTube className='movieTrailer' videoId={movie.trailer_url.split("=")[1]} />
                </article>
                <article className='third'>
                    <Typography style={{textAlign: "inherit"}}><strong>Rate this movie:</strong></Typography>
                    <Rating defaultValue={0} precision={1} style={{ color: 'yellow' }} icon={<StarBorderIcon />} />
                    <Typography style={{ marginTop: "16px", marginBottom: "16px", textAlign: "inherit" }}><strong>Artists:</strong></Typography>
                    <ImageList className='listOfActors' cols={2} rowHeight={250}>
                        {movie.artists.map((item) => (
                            <ImageListItem key={item.id}>
                                <img className="actors" src={item.profile_url} alt="actor" />
                                <ImageListItemBar title={item.first_name + " " + item.last_name} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </article>
            </section>
        </div>
    );
}

