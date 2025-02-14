"use client"; // Ensure this is a client-side component
import { getAIResponse } from '@/configs/AIModel'; // Import the getAIResponse function
import { api } from '@/convex/_generated/api';
import { useAction } from 'convex/react';
import {
  AlignCenter, AlignLeft, AlignRight, Bold,
  Heading1, Heading2, Heading3, Italic, Sparkles, Underline
} from 'lucide-react';
import { useParams } from 'next/navigation';

function EditorExtension({ editor }) {
  const { fileId } = useParams();
  const SearchAI = useAction(api.myAction.search);

  const onAiClick = async () => {
    if (!editor) return;

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ''
    );
    
    console.log("Selected Text:", selectedText);

    try {
      const result = await SearchAI({
        query: selectedText,
        fileId: fileId,
      });

      console.log("Unformatted Answer:", result);

      if (!result || result.message === "No search results found.") {
        console.log("No results found for the query.");
        return;
      }

      let AllUnformattedAns = '';

      if (Array.isArray(result.data)) {
        result.data.forEach(item => {
          if (item.pageContent) {
            AllUnformattedAns += item.pageContent + "\n";
          }
        });
      }

      const PROMPT = `For the question: "${selectedText}" and with the given content as an answer, please give an appropriate answer in HTML format. The answer content is: "${AllUnformattedAns}"`;

      const FinalAns = await getAIResponse(PROMPT);
      console.log("Formatted Answer:", FinalAns);

      const ALLText = editor.getHTML();
      editor.commands.setContent(ALLText + `<p><strong>Answer: </strong>${FinalAns}</p>`);
    } catch (error) {
      console.error("Error during AI model response:", error);
    }
  };

  if (!editor) return null;

  return (
    <div className="p-5">
      <div className="control-group">
        <div className="button-group flex gap-3">
          {/* Formatting buttons */}
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'text-green-500' : ''}><Bold /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'text-blue-500' : ''}><Italic /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'text-red-500' : ''}><Underline /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'text-purple-500' : ''}><Heading1 /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'text-purple-400' : ''}><Heading2 /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'text-purple-300' : ''}><Heading3 /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'text-orange-500' : ''}><AlignLeft /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'text-orange-400' : ''}><AlignCenter /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'text-orange-300' : ''}><AlignRight /></button>

          {/* AI Search Button */}
          <button onClick={onAiClick} className={'hover:text-blue-500'}><Sparkles /></button>
        </div>
      </div>
    </div>
  );
}

export default EditorExtension;
