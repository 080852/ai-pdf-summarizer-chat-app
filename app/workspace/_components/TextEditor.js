import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function TextEditor() {
    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder:'start taking the notes here....'
            })
        ],

        
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
      })
  return (
    <div>
        <div>
        <EditorContent editor={editor} />
        </div>
      
    </div>
  )
}

export default TextEditor
