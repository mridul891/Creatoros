"use client"

import { Highlight } from "@tiptap/extension-highlight"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Selection } from "@tiptap/extensions"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { useEffect, useRef, useState } from "react"
import { HorizontalRule } from "@/features/scripts/editor/nodes/horizontal-rule-node/horizontal-rule-node-extension"
// --- Tiptap Node ---
import { ImageUploadNode } from "@/features/scripts/editor/nodes/image-upload-node/image-upload-node-extension"
// --- UI Primitives ---
import { Button } from "@/features/scripts/editor/primitives/button"
import { Spacer } from "@/features/scripts/editor/primitives/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/features/scripts/editor/primitives/toolbar"
import "@/features/scripts/editor/nodes/blockquote-node/blockquote-node.scss"
import "@/features/scripts/editor/nodes/code-block-node/code-block-node.scss"
import "@/features/scripts/editor/nodes/horizontal-rule-node/horizontal-rule-node.scss"
import "@/features/scripts/editor/nodes/list-node/list-node.scss"
import "@/features/scripts/editor/nodes/image-node/image-node.scss"
import "@/features/scripts/editor/nodes/heading-node/heading-node.scss"
import "@/features/scripts/editor/nodes/paragraph-node/paragraph-node.scss"

// --- Icons ---
import { ArrowLeftIcon } from "@/features/scripts/editor/icons/arrow-left-icon"
import { HighlighterIcon } from "@/features/scripts/editor/icons/highlighter-icon"
import { LinkIcon } from "@/features/scripts/editor/icons/link-icon"
import { BlockquoteButton } from "@/features/scripts/editor/ui/blockquote-button"
import { CodeBlockButton } from "@/features/scripts/editor/ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "@/features/scripts/editor/ui/color-highlight-popover"
// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/features/scripts/editor/ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/features/scripts/editor/ui/image-upload-button"
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from "@/features/scripts/editor/ui/link-popover"
import { ListDropdownMenu } from "@/features/scripts/editor/ui/list-dropdown-menu"
import { MarkButton } from "@/features/scripts/editor/ui/mark-button"
import { TextAlignButton } from "@/features/scripts/editor/ui/text-align-button"
import { UndoRedoButton } from "@/features/scripts/editor/ui/undo-redo-button"
// --- Lib ---
import {
  handleImageUpload,
  MAX_FILE_SIZE,
} from "@/features/scripts/utils/tiptap-utils"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"
// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"

// --- Styles ---
import "@/features/scripts/editor/templates/simple/simple-editor.scss"

import content from "@/features/scripts/editor/templates/simple/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}
