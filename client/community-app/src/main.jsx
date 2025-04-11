//product-app/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
//import './pages/CommunityPage.css';
//
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme.js";
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)