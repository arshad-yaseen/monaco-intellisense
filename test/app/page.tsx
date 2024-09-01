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
        hello: {
          world: {
            super: {
              nack: {
                adipoli: 'Hello',
                number: 42,
                boolean: true,
                null: null,
                undefined: undefined,
                array: [1, 2, 3],
                object: {
                  nestedKey: 'nestedValue',
                },
                function: () => console.log('Hello from function'),
              },
            },
          },
        },
        goodbye: {
          universe: {
            amazing: {
              wow: {
                incredible: 'Goodbye',
                bigInt: BigInt(9007199254740991),
                symbol: Symbol('unique'),
                date: new Date(),
                regexp: /pattern/g,
                map: new Map([['key', 'value']]),
                set: new Set([1, 2, 3]),
              },
            },
          },
        },
        deepNesting: {
          level1: {
            level2: {
              level3: {
                level4: {
                  level5: {
                    deepestValue: "You've gone too deep!",
                  },
                },
              },
            },
          },
        },
      },
      {
        templateExpressionDelimiters: ['["', '"]'],
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
        onMount={(_, monaco) => {
          setMonaco(monaco);
        }}
      />
    </main>
  );
}
