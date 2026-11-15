# Lab window manager

Confirmed: the terminal, Git history, editor, and repository portal are stackable,
reorderable windows, including on small viewports. This document specifies the
required behavior. See [architecture.md](architecture.md) for implemented scope
and [testing.md](testing.md) for verification evidence.

## Behavior

| Feature | Proposal |
| --- | --- |
| Initial desktop | Four windows in a 2×2 grid |
| Activation | Clicking or moving focus into a window brings it to the front |
| Dock | Four always-accessible buttons with names and states |
| Minimize | Hide the window while preserving its contents, cursor, and history |
| Restore | Recover its position and last valid focus |
| Maximize | Fill the lab area while keeping the HUD, dock, and exit available |
| Move/resize | Dragging or a menu with equivalent keyboard controls |
| Arrange | Grid, side-by-side, cascade, and reset-layout presets |
| Overview | List all four windows with their states and recovery actions |

The main windows minimize; they cannot be closed accidentally. Close applies
to temporary elements such as a file comparison. No layout command destroys
Git state or recreates the editor.

## Keyboard and accessibility

Represent windows as labeled, non-modal regions, with stable DOM order even
when their z-order changes. When focus enters a covered window, reveal it
before the focused control could remain hidden.

Each title provides a menu with Move, Resize, Minimize, Maximize, and presets.
In Move mode, arrow keys move the window, Enter confirms, and Escape cancels.
Announce the mode without intercepting browser or operating-system shortcuts.
Resize offers width and height values with buttons to change them. No operation
may require dragging as its only input method.

Minimizing moves focus to the dock button; hidden contents are removed from
the accessibility tree and tab order while retaining their state in memory.
Leaving maximized mode restores the previous layout and focus. Overview can
be a dialog that returns focus to its trigger. The terminal and editor provide
a documented keyboard exit. In plain-text mode, Tab leaves the field and a
separate command handles indentation.

Keep movement announcements concise rather than reading coordinates at every
pixel. Remove movement and zoom animations with `prefers-reduced-motion`.

## Small viewports

Use cascading overlapping windows with a dock and overview, rather than a
UI consisting only of tabs. The active window may occupy almost all the space
and can be maximized. Side-by-side presets are available only when content
remains readable. Keep titles and recovery controls reachable after rotation,
resizing, or opening the virtual keyboard. No control may depend on hover alone.

The page viewport must not require horizontal scrolling. Code and graphs may
scroll internally when needed; the graph also has a text list. Target 44 CSS px
for primary controls, verifying the rendered layout at 320 CSS px, 200% text
size, and 400% zoom.

## Persistence

Store local preferences by account, browser/device, and viewport class,
separately from the repository and Zundo history. Undoing a Git command does
not move windows. Do not promise layout synchronization between devices.

Save normalized positions, sizes, and states; validate versions and bounds on
restore. Out-of-bounds coordinates fall back to a safe preset. Reset window
layout affects windows; Reset exercise affects the scenario and does not
erase a previously confirmed completion.

## IT/EN messages

The following Italian strings are product localization examples; documentation
and technical identifiers remain in English.

| Italian | English |
| --- | --- |
| Ripristina Terminale | Restore Terminal |
| Ingrandisci finestra | Maximize window |
| Ripristina dimensioni | Restore window size |
| Mostra tutte le finestre | Show all windows |
| Disponi finestre | Arrange windows |
| Ripristina disposizione | Reset window layout |
| Disposizione salvata su questo dispositivo. | Window layout saved on this device. |
| Tempo di studio stimato | Estimated study time |
| Il timer di studio è in pausa. Il tempo ufficiale continua. | The study timer is paused. Official elapsed time continues. |
| La stima usa i segnali del browser. Cambiare finestra non modifica il punteggio. | The estimate uses browser signals. Switching windows does not affect your score. |

## Acceptance criteria

Complete the scenario and every window-manager operation using only a keyboard.
Recover every window after overlap, viewport changes, and stale layout data.
Preserve focus, selection, and cursor position. Check screen readers, touch,
both themes, and both languages. Switching between simulated windows must not
trigger a document pause. Audit the rendered product before launch.
