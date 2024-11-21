import * as React from "react";
import "@/components/ui/minimal-tiptap/styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import type { UseMinimalTiptapEditorProps } from "@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap";
import { EditorContent } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utilities/style";
import { SectionOne } from "@/components/ui/minimal-tiptap/components/section/one";
import { SectionTwo } from "@/components/ui/minimal-tiptap/components/section/two";
import { SectionThree } from "@/components/ui/minimal-tiptap/components/section/three";
import { SectionFour } from "@/components/ui/minimal-tiptap/components/section/four";
import { SectionFive } from "@/components/ui/minimal-tiptap/components/section/five";
import { LinkBubbleMenu } from "@/components/ui/minimal-tiptap/components/bubble-menu/link-bubble-menu";
import { useMinimalTiptapEditor } from "@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap";
import { MeasuredContainer } from "@/components/ui/minimal-tiptap/components/measured-container";
import { useImperativeHandle } from "react";

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  getEditor?: (editor: Editor) => void;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="default" />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={["italic", "bold", "underline", "strikethrough", "clearFormatting"]}
        mainActionCount={5}
        variant="default"
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} variant="default" />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["bulletList", "orderedList"]}
        mainActionCount={2}
        variant="default"
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={["blockquote", "codeBlock", "horizontalRule"]}
        mainActionCount={3}
        variant="default"
      />
    </div>
  </div>
);

export interface ApprenticeNoteEditorRef {
  editor: Editor;
  // updateVariable: (newValue: string) => void;
}

export const ApprenticeNoteEditor = React.forwardRef<ApprenticeNoteEditorRef, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, getEditor, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    });

    if (!editor) return null;

    useImperativeHandle(ref, () => ({
      editor,
    }));

    return (
      <MeasuredContainer
        as="div"
        name="editor"
        className={cn(
          "flex h-auto min-h-72 w-full flex-col border border-input focus-within:border-primary border-none outline-none",
          className,
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={cn("minimal-tiptap-editor", editorContentClassName)}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    );
  },
);

ApprenticeNoteEditor.displayName = "ApprenticeNoteEditor";

export default ApprenticeNoteEditor;
