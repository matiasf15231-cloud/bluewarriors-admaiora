'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './Toolbar';
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'

const Tiptap = ({
  content,
  onChange,
}: {
  content: any;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[250px] border border-input rounded-md">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;