import { createRoot } from 'react-dom/client';
import { DialogBox } from './DialogBox';
import type { DialogBoxProps } from './DialogBox';
import { useState, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';

const root = document.createElement('chrome-extension-boilerplate-react-vite-content-view-root');
root.style.zIndex = '2147483647';
document.body.after(root);

const shadowRootElement = document.createElement('div');
shadowRootElement.id = 'shadow-root';
const shadowContainer = root.attachShadow({ mode: 'open' });
shadowContainer.appendChild(shadowRootElement);

// Shadow DOM対応（おまじない）
const cache = createCache({ key: 'shadow-css', prepend: true, container: shadowContainer });
const theme = createTheme({
  cssVariables: { rootSelector: '#shadow-root', colorSchemeSelector: 'class' },
  components: {
    MuiPopover: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
    MuiPopper: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
  },
});

const App = () => {
  const [mode, setMode] = useState<'dialog' | 'idle'>('idle');
  const [data, setData] = useState<DialogBoxProps | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const handleDialogClose = () => {
    setMode('idle');
  };

  useEffect(() => {
    const listener = (message: any) => {
      if (message.type === 'SHOW') {
        const data: DialogBoxProps = {
          translatedText: message.data.translatedText.toString(),
          originalText: message.data.originalText.toString(),
          targetLang: message.data.lang.toString(),
          onClose: handleDialogClose,
        };
        if (rect === null) {
          setRect(window.getSelection()?.getRangeAt(0).getBoundingClientRect() ?? null);
        }
        setData(data);
        setMode('dialog');
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [rect]);
  return (
    <>
      {mode === 'dialog' && data !== null && rect !== null && (
        <div style={{ position: 'absolute', width: '100%', left: '0px', top: '0px', zIndex: 2147483550 }}>
          <div
            style={{
              position: 'absolute',
              left: window.scrollX + rect.left,
              top: window.scrollY + rect.bottom + 10,
              zIndex: 2147483550,
            }}>
            <DialogBox {...data} />
          </div>
        </div>
      )}
    </>
  );
};

createRoot(shadowRootElement).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme} colorSchemeNode={shadowRootElement}>
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
