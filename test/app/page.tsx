'use client';

import {useEffect, useState} from 'react';

import Editor, {Monaco} from '@monaco-editor/react';
import {object} from 'monaco-intellisense';

export default function Home() {
  const [monaco, setMonaco] = useState<Monaco | null>(null);

  useEffect(() => {
    if (!monaco) return;

    const objectIntellisense = object(monaco).nested(
      {
        user: {
          name: 'John Doe',
          age: 30,
          address: {
            street: '123 Main St',
            city: 'Anytown',
            zip: '12345',
          },
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      },
      {
        templateExpressionDelimiters: ['{{', '}}'],
      },
    );

    return () => {
      objectIntellisense.dispose();
    };
  }, [monaco]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Editor
        height="90vh"
        language="javascript"
        theme="vs-dark"
        onMount={(_, monaco) => {
          setMonaco(monaco);
        }}
        options={{
          padding: {
            top: 10,
          },
        }}
      />
    </main>
  );
}
