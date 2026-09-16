# Accessibility notes

Sluiceboard treats alarm triage as a keyboard-first workflow.

- Every form control has a visible label or an explicit accessible name.
- The station switcher, segmented status controls, checkboxes, and action buttons use native elements.
- Focus moves to the alarm title when the report form opens and returns to the trigger when it closes.
- Bulk-operation results are announced through a polite live region.
- Acknowledgement progress exposes text plus `role="progressbar"` values.
- Alarm status and severity are written as words and never conveyed by color alone.
- Selected rows retain their checkbox state when filters hide them.
- Table headings and row headings preserve relationships for screen-reader navigation.
- Focus indicators remain visible against every control-room surface.
- Reduced-motion preferences remove nonessential transitions.

The table is horizontally scrollable on narrow screens instead of compressing labels into unreadable columns.
