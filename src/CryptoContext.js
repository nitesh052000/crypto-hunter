import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";
import { doc } from "firebase/firestore";
import axios from "axios";
import { CoinList } from "./config/api";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setsymbol] = useState("₹");
  const [user, setUser] = useState(null);
  const [watchlist, setWactchlist] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (user) {
      const coinref = doc(db, "watchlist", user.uid);
      var unsub = onSnapshot(coinref, (coin) => {
        if (coin.exists()) {
          setWactchlist(coin.data().coins);

          //  console.log(coin.data());
        } else {
          //console.log("No item in watchlist");
        }
      });
      return () => {
        unsub();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  useEffect(() => {
    if (currency === "INR") setsymbol("₹");
    else if (currency === "USD") setsymbol("$");
  }, [currency]);

  const fetchcoins = async () => {
    setLoading(true);

    const { data } = await axios.get(CoinList(currency));
    setCoins(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchcoins();
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        alert,
        setAlert,
        user,
        watchlist,
        coins,
        loading,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
