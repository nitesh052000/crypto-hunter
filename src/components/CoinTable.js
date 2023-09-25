import React from "react";
import { useState } from "react";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import {
  Container,
  LinearProgress,
  Paper,
  TableContainer,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import TableHead from "@material-ui/core/TableHead";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    fontFamily: "Montserrat",
    "&:hover": {
      backgroundColor: "#131111",
    },
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
}));

export function numberwithcommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();
  const [page, setPage] = useState(1);

  const { currency } = CryptoState();

  const classes = useStyles();

  const fetchcoins = async () => {
    setLoading(true);

    const { data } = await axios.get(CoinList(currency));
    setCoins(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchcoins();
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handlesearch = () => {
    if (search === "") return coins;

    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          CryptoCurrency Prices by Market cap{" "}
        </Typography>
        <TextField
          label="search for a crypto currency.."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  <TableCell
                    style={{
                      color: "black",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Coin
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      color: "black",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      color: "black",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                  >
                    24th Change
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      color: "black",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Market Cap
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {handlesearch()
                  .slice((page - 1) * 10, page * 10)
                  .map((head) => {
                    let profit = head.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => history.push(`/coins/${head.id}`)}
                        key={head.name}
                        className={classes.row}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={head?.image}
                            height="50"
                            alt={head.name}
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {head.symbol}
                            </span>

                            <span style={{ color: "darkgrey" }}>
                              {head.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {currency === "INR"
                            ? "₹" + " " + numberwithcommas(head?.current_price)
                            : "$" + " " + numberwithcommas(head?.current_price)}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14,203,129" : "red",
                            fontWeight: "500",
                          }}
                        >
                          {profit
                            ? "+" +
                              head?.price_change_percentage_24h?.toFixed(2)
                            : head?.price_change_percentage_24h?.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {currency === "INR"
                            ? "₹" +
                              " " +
                              numberwithcommas(
                                head?.market_cap.toString().slice(0, -6)
                              ) +
                              "M"
                            : "$" +
                              " " +
                              numberwithcommas(
                                head?.market_cap.toString().slice(0, -6)
                              ) +
                              "M"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          count={Number((coins?.length / 10).toFixed(0))}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinTable;
