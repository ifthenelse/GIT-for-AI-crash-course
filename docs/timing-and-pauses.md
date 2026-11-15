# Official elapsed time and estimated breaks

Confirmed requirements: a server-recorded start, elapsed time, and browser
visibility signals to estimate interruptions. This document specifies their
behavior; implemented scope and verification evidence are recorded in
[architecture.md](architecture.md) and [testing.md](testing.md).

## Measurements and use

| Measurement | Source | Use |
| --- | --- | --- |
| `elapsedMs` | First valid completion receipt minus start, both recorded by the server | Official exercise duration |
| `visibleMsEstimated` | Intervals with the document visible | Estimated personal summary |
| `focusedVisibleMsEstimated` | Document visible and browser window focused | Estimated study time, without proof of attention |
| `hiddenMsEstimated` | Intervals with the document hidden | Estimated break time |
| `unfocusedVisibleMsEstimated` | Visible but unfocused | Possible interruption, distinct from a hidden page |
| Transitions | Separate hidden/visible and focus/blur counts | Summary of observed interruptions |
| `coverage` | Continuity of observations | `complete`, `partial`, or `truncated` |

Server duration includes reading, breaks, and waiting until valid receipt.
Estimates are not subtracted from official elapsed time, do not change points,
and do not block unlocks or completions. A visible page can be unattended;
consulting documentation in another window can be part of studying. There is
no penalty for switching tabs or using assistive technology.

The "Estimated study time" timer pauses when the page is hidden or the window
loses focus, and resumes when it is visible and focused. The summary keeps
these intervals separate. Do not describe it as a measurement of attention.

## Events and state machine

- Attach the main listener to **`document`** for the lowercase event
  `visibilitychange`; read `document.visibilityState` immediately.
- `window.blur`/`window.focus` add an independent signal. Blur does not mean
  the page is hidden: browser chrome, dialogs, or side-by-side displays can cause it.
- `pagehide` closes the document segment; `pageshow` samples state and focus
  again. When `event.persisted` is true, handle BFCache without creating a new
  server attempt.
- Sample state at the start and end even if no transition occurred.
- Deduplicate repeated states. `hidden` followed by `pagehide` does not add two breaks.
- Focus and selection among the four simulated windows happen inside the
  document; they must not produce breaks or loss of browser-window focus.

Timing states are disjoint: visible/focused, visible/unfocused, hidden, and
unobserved. Do not add blur and hidden as overlapping durations. The client
does not observe external applications, windows, or addresses.

## Clock, lifecycle, and recovery

Use `performance.now()` for intervals within one document. Reloads and
navigations create segments with different identifiers: do not subtract
timestamps from different documents. Repeating timers only redraw the UI;
do not add up ticks, because background pages can be throttled.

Sleep, mobile suspension, forced closure, and missing final events can leave
gaps. During sleep, `performance.now()` does not advance consistently across
browsers and operating systems: a long visible interval does not prove
continuous activity. Gaps become unobserved time and partial coverage, without
inventing breaks or attention. Even complete event coverage does not prove attention.

Persist locally during work and on transitions, saving scenario changes early.
Do not rely on `unload`/`beforeunload` or a network request made while the page
is closing. The final POST remains idempotent and retryable through the local queue.

If completion happens offline, the client clock does not backdate the official
result: the delay until server acceptance is included and stated in the UI.
A retry after acceptance returns the original result without increasing its duration.

## Candidate protocol

Include an optional ledger in the final POST containing a version, coverage,
dropped-event count, and segments. Each segment contains a `documentId`; each
event contains a sequence number, relative offset, cause, visibility, focus,
and `persisted` where relevant. No heartbeats or separate analytics endpoints.

Proposed limits to validate: 512 events and 32 KiB per attempt, with duration
precision limited to what is needed, for example rounding to 100 ms. Above
that limit, count dropped events and mark coverage `truncated`; the exercise
must remain completable.

The server checks limits, enums, ordering, and finite, nonnegative values, then
recalculates aggregates. These remain browser claims: `event.isTrusted` does
not certify an HTTP payload. Missing or invalid telemetry makes only the
estimates unavailable; it does not invalidate an otherwise verified exercise.
The Git action log has separate limits and validation.

## Multiple tabs and privacy

One local writer per attempt is coordinated across tabs; other tabs offer an
explicit transfer of control. Browser coordination and locks improve the UI
but do not provide an anti-cheating boundary. The server maintains attempt
ownership, uniqueness, and idempotency across different devices as well.

Prefer storing only aggregates and coverage on the server. Delete the raw
ledger after calculation unless a justified short diagnostic period is defined.
Never collect other pages' URLs, window titles, open applications, screenshots,
clipboard contents, or keystrokes. Breaks and focus changes are not published
on the leaderboard.

## Verification before release

Test tab/app switching, a minimized browser, dialogs, two monitors, switching
between panels, reloads, back/forward BFCache, sleep, mobile use, duplicate
events, ledger overflow, unavailable storage, multiple tabs, and offline
completion. Verify that client signals leave server duration unchanged and
that context switching carries no penalty.

Sources: [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API),
[visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event),
[performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now),
[pagehide](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event),
[pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event),
[BFCache](https://web.dev/articles/bfcache).
