import { makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom/cjs/react-router-dom";

const useStyles = makeStyles((theme) => ({
  Carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
  ok: {
    fontWeight: "bold",
  },
}));

export function numberwithcommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const [trending, setTrending] = useState([]);

  const classes = useStyles();
  const { currency } = CryptoState();

  const fetchTrenCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    setTrending(data);
  };

  // console.log(trending);

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img src={coin.image} height="80" style={{ marginBottom: 10 }} />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14,203,129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit
              ? "+" + coin?.price_change_percentage_24h?.toFixed(2)
              : coin?.price_change_percentage_24h?.toFixed(2)}
          </span>
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          {currency === "INR"
            ? "₹" + " " + numberwithcommas(coin?.current_price)
            : "$" + " " + numberwithcommas(coin?.current_price)}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  useEffect(() => {
    fetchTrenCoins();
  }, [currency]);

  return (
    <div className={classes.Carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
