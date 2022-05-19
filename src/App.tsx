import React from 'react';
import './App.css';
import ScanQrByCode from "./components/ScanQrByCode";
import {LinearProgress} from "@mui/material";

function App() {
  return (
      <>
        <LinearProgress />
        <ScanQrByCode />
      </>
  );
}

export default App;
