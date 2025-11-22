import './globals.css';
import LayoutWrapper from './components/LayoutWrapper.jsx';
import AiAssistantWindowWrapper from './components/AiAssistantWindowWrapper.jsx';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <AiAssistantWindowWrapper />
      </body>
    </html>
  );
}