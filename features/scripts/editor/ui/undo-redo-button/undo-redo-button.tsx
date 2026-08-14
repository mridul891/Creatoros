"use client"

import { forwardRef, useCallback } from "react"
import { Badge } from "@/features/scripts/editor/primitives/badge"
// --- UI Primitives ---
import type { ButtonProps } from "@/features/scripts/editor/primitives/button"
import { Button } from "@/features/scripts/editor/primitives/button"
// --- Tiptap UI ---
import type {
  UndoRedoAction,
  UseUndoRedoConfig,
} from "@/features/scripts/editor/ui/undo-redo-button"
import {
  UNDO_REDO_SHORTCUT_KEYS,
  useUndoRedo,
} from "@/features/scripts/editor/ui/undo-redo-button"
// --- Hooks ---
import { useTiptapEditor } from "@/features/scripts/hooks/use-tiptap-editor"
// --- Lib ---
import { parseShortcutKeys } from "@/features/scripts/utils/tiptap-utils"

export interface UndoRedoButtonProps
  extends Omit<ButtonProps, "type">,
    UseUndoRedoConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean
}

export function HistoryShortcutBadge({
  action,
  shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action],
}: {
  action: UndoRedoAction
  shortcutKeys?: string
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>
}

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = forwardRef<
  HTMLButtonElement,
  UndoRedoButtonProps
>(
  (
    {
      editor: providedEditor,
      action,
      text,
      hideWhenUnavailable = false,
      onExecuted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } =
      useUndoRedo({
        editor,
        action,
        hideWhenUnavailable,
        onExecuted,
      })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleAction()
      },
      [handleAction, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        disabled={!canExecute}
        variant="ghost"
        data-disabled={!canExecute}
        role="button"
        tabIndex={-1}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <HistoryShortcutBadge
                action={action}
                shortcutKeys={shortcutKeys}
              />
            )}
          </>
        )}
      </Button>
    )
  }
)

UndoRedoButton.displayName = "UndoRedoButton"
