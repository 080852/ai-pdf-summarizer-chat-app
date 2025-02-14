import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorExtension from './EditorExtension';

function TextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Enable text alignment for headings and paragraphs
      }),
      Placeholder.configure({
        placeholder: 'Start taking the notes here...', // Customize the placeholder text
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5', // Define custom styles for the editor
      },
    },
  });

  return (
    <div>
      {/* Render the toolbar for text formatting */}
      <EditorExtension editor={editor} />

      {/* Render the main editor content */}
      <div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TextEditor;
