import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import { HistoricalChart } from "../config/api";
import axios from "axios";
import { Button, CircularProgress, ThemeProvider } from "@material-ui/core";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import { Line } from "react-chartjs-2";

const CoinFor = ({ coin }) => {
  const [historical, setHistorical] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "25px",
      padding: "40px",
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
      button: {
        cursor: "pointer",
      },
    },
  }));

  const classes = useStyles();

  const fetchchart = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistorical(data.prices);
  };

  // console.log(historical);

  useEffect(() => {
    fetchchart();
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historical ? (
          <CircularProgress
            style={{
              color: "gold",
            }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historical.map((coin) => {
                  let date = new Date(coin[0]);

                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours() - 12}:${date.getMinutes()} AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historical.map((coin) => coin[1]),
                    label: `Price (Past ${days} Days) in ${currency}`,
                    borderColor: "rgb(75, 192, 192)",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Button variant="outlined" onClick={() => setDays(1)}>
                24 Hour
              </Button>
              <Button variant="outlined" onClick={() => setDays(30)}>
                30 Days
              </Button>
              <Button variant="outlined" onClick={() => setDays(90)}>
                3 Months
              </Button>
              <Button variant="outlined" onClick={() => setDays(365)}>
                1 Year
              </Button>
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};
export default CoinFor;
