'use client';

import { usePathname } from 'next/navigation';
import AiAssistantWindow from './AiAssistantWindow.jsx';

export default function AiAssistantWindowWrapper() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isEnterPage = pathname === '/enter';
  const isRootPage = pathname === '/';

  // Hide AI button on login and enter pages
  if (isLoginPage || isEnterPage || isRootPage) {
    return null;
  }

  return <AiAssistantWindow />;
}

