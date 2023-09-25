import { Container, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import Carousel from "./Carousel";

const useStyles = makeStyles(() => ({
  banner: {
    backgroundImage: "url(./banner2.jpg)",
  },
  bannercontent: {
    height: 400,
    display: "flex",
    flexDirection: "column",
    paddingTop: 25,
    justifyContent: "space-around",
  },
  tag: {
    justifyContent: "center",
    textAlign: "center",
    height: "40%",
    flexDirection: "column",
    display: "flex",
  },
}));

const Banner = () => {
  const classes = useStyles();

  return (
    <div className={classes.banner}>
      <Container className={classes.bannercontent}>
        <div className={classes.tag}>
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontFamily: "Montserrat",
            }}
          >
            Crypto Hunter
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "darkgrey",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
            }}
          >
            Get all info Regarding Your Favorite Crypto Currency
          </Typography>
        </div>

        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;
