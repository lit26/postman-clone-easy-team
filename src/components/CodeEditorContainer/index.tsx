import React, { useState, useRef, useEffect } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { defaultTabBinding } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";

const basicExtensions = [
  basicSetup,
  keymap.of([defaultTabBinding]),
  json(),
  EditorState.tabSize.of(2),
];

interface CodeEditorContainerProps {
  doc: string;
  changeRequestItem?: (requestKey: string, requestValue: string) => void;
  isEditable?: boolean;
}

const CodeEditorContainer: React.FC<CodeEditorContainerProps> = ({
  doc,
  changeRequestItem,
  isEditable = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [curDoc, setCurDoc] = useState<any>("");

  useEffect(() => {
    setCurDoc(doc);
  }, [doc]);

  useEffect(() => {
    if (editorRef.current === null) return;
    const state = EditorState.create({
      doc: doc,
      extensions: [
        ...basicExtensions,
        EditorView.updateListener.of((view) => {
          if (view.docChanged) {
            setCurDoc(view.state.doc);
          }
        }),
        EditorView.editable.of(isEditable),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [doc, isEditable, setCurDoc]);

  return (
    <div
      className="editor-pane"
      ref={editorRef}
      onBlur={() =>
        changeRequestItem && changeRequestItem("doc", curDoc.toString())
      }
    ></div>
  );
};

export default CodeEditorContainer;
