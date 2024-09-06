'use client';

import {useEffect, useState} from 'react';

import Editor, {Monaco} from '@monaco-editor/react';
import {object} from 'monaco-intellisense';

export default function Home() {
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    initTime: number;
    disposalTime: number;
  } | null>(null);

  useEffect(() => {
    if (!monaco) return;

    const startTime = performance.now();

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

    const initTime = performance.now() - startTime;
    setPerformanceMetrics(prev => ({
      initTime,
      disposalTime: prev?.disposalTime ?? 0,
    }));

    return () => {
      const disposalStartTime = performance.now();
      objectIntellisense.dispose();
      const disposalTime = performance.now() - disposalStartTime;
      setPerformanceMetrics(prev => {
        if (prev === null) {
          return {initTime: 0, disposalTime};
        }
        return {...prev, disposalTime};
      });
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
      {performanceMetrics && (
        <div className="mt-4">
          <p>
            Initialization Time: {performanceMetrics.initTime.toFixed(2)} ms
          </p>
          {performanceMetrics.disposalTime && (
            <p>
              Disposal Time: {performanceMetrics.disposalTime.toFixed(2)} ms
            </p>
          )}
        </div>
      )}
    </main>
  );
}
