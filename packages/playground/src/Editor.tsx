import * as Y from 'yjs';
import { useEffect, useRef, useState } from 'react';
import {
  RangeStatic,
  Signal,
  TextEditor,
  UpdateRangeStaticProp,
} from '@blocksuite/virgo';
import { SlButton } from '@shoelace-style/shoelace/dist/react';

export const Editor = () => {
  const editorARootRef = useRef<HTMLDivElement>(null);
  const editorBRootRef = useRef<HTMLDivElement>(null);

  const [rangeStaticA, setRangeStaticA] = useState<RangeStatic | null>(null);
  const [rangeStaticB, setRangeStaticB] = useState<RangeStatic | null>(null);

  const undoManagerA = useRef<Y.UndoManager | null>(null);
  const undoManagerB = useRef<Y.UndoManager | null>(null);

  useEffect(() => {
    const yDocA = new Y.Doc();
    const yDocB = new Y.Doc();

    yDocA.on('update', update => {
      Y.applyUpdate(yDocB, update);
    });

    yDocB.on('update', update => {
      Y.applyUpdate(yDocA, update);
    });

    if (editorARootRef.current) {
      const textA = yDocA.getText('text');
      undoManagerA.current = new Y.UndoManager(textA);

      const signal = new Signal<UpdateRangeStaticProp>();
      signal.on(([range]) => {
        setRangeStaticA(range);
      });

      const editorA = new TextEditor('A', editorARootRef.current, textA, {
        updateRangeStatic: signal,
      });
    }
    if (editorBRootRef.current) {
      const textB = yDocB.getText('text');
      undoManagerB.current = new Y.UndoManager(textB);

      const signal = new Signal<UpdateRangeStaticProp>();
      signal.on(([range]) => {
        setRangeStaticB(range);
      });

      const editorB = new TextEditor('B', editorBRootRef.current, textB, {
        updateRangeStatic: signal,
      });
    }
  }, []);

  return (
    <div className={'grid grid-rows-2 gap-4 h-full w-full'}>
      <div className={'grid grid-cols-[80px_1fr_1fr]'}>
        <div className={'p-2'}>Doc A</div>
        <div
          className={'p-2 bg-neutral-900 rounded-md'}
          suppressContentEditableWarning
          contentEditable={true}
          ref={editorARootRef}
        ></div>
        <div className={'p-2 grid grid-rows-[1fr_40px_40px]'}>
          <div>{rangeStaticA ? JSON.stringify(rangeStaticA) : 'null'}</div>
          <SlButton
            onClick={() => {
              if (undoManagerA.current) {
                undoManagerA.current.undo();
              }
            }}
          >
            Undo
          </SlButton>
          <SlButton
            onClick={() => {
              if (undoManagerA.current) {
                undoManagerA.current.redo();
              }
            }}
          >
            Redo
          </SlButton>
        </div>
      </div>
      <div className={'grid grid-cols-[80px_1fr_1fr]'}>
        <div className={'p-2'}>Doc B</div>
        <div
          className={'p-2 bg-neutral-900 rounded-md'}
          suppressContentEditableWarning
          contentEditable={true}
          ref={editorBRootRef}
        ></div>
        <div className={'p-2 grid grid-rows-[1fr_40px_40px]'}>
          <div>{rangeStaticB ? JSON.stringify(rangeStaticB) : 'null'}</div>
          <SlButton
            onClick={() => {
              if (undoManagerB.current) {
                undoManagerB.current.undo();
              }
            }}
          >
            Undo
          </SlButton>
          <SlButton
            onClick={() => {
              if (undoManagerB.current) {
                undoManagerB.current.redo();
              }
            }}
          >
            Redo
          </SlButton>
        </div>
      </div>
    </div>
  );
};
