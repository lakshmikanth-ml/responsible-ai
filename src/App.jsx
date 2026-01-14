import React from 'react'
import Zoom from '@mui/material/Zoom';

import Router from './routes/Index'
import ThemeProvider from './theme/Index'
import { useScrollToTop } from './hooks/use-scroll-to-top'
import ReduxProvider from './redux/redux-provider'
import SnackbarListener from './components/snakbar/Index'
import { SnackbarProvider } from 'notistack';
import SessionExpireModal from './components/modal/SessionExpireModal';
import "./index.css"


function App() {
  useScrollToTop();
  return (
    <ReduxProvider>

      <ThemeProvider>
        <SnackbarProvider maxSnack={4}
          anchorOrigin={{ vertical: "bottom", horizontal: 'center' }}
          autoHideDuration={6000}
          TransitionComponent={Zoom}
        >
          <SnackbarListener />
          <Router />
          <SessionExpireModal />
        </SnackbarProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default App