---
title: "Drag and Drop without Leaving Anyone Behind"
date: 2026-10-14 18:04:34 +00:00
comments: true
tags:
  [
    "accessibility",
    "forms",
    "HTML",
    "JavaScript",
    "progressive enhancement",
    "web components",
    "web forms",
    "user experience",
  ]
description: "The `<form-dropzone>` web component adds drag-and-drop, status announcements, and optional image previews to a native file `<input>` without taking away its fallback."
twitter_text: "Drag-and-drop file fields are convenient, but dragging can’t be the only option. I created a web component that enhances a native file input without replacing it."
---

Dragging a file onto a page can be much faster than opening a picker and retracing your steps through the filesystem. That convenience has made drop zones a familiar part of upload forms, but they’re often built as though everyone can drag, everyone knows where to drop, and the browser’s file input is an implementation detail best hidden from view.

It isn’t. The native file input is the dependable part. My new [`<form-dropzone>`](https://github.com/aarongustafson/form-dropzone) web component keeps it intact and layers drag-and-drop, clear status messages, and optional image previews around it.

<!-- more -->

The layout and interaction were inspired by Nikita Hlopov’s article, [“Custom styled input type file”](https://nikitahl.com/custom-styled-input-type-file). I liked the way that approach treated the real input and label as assets rather than obstacles, and I wanted to package that progressive enhancement into something reusable.

## Begin with a file field

The component expects one `input[type="file"]` and its associated `<label>`:

```html
<form-dropzone>
  <label for="attachments">Choose files</label>
  <input
    id="attachments"
    name="attachments"
    type="file"
    accept=".pdf,image/*"
    multiple
  />
</form-dropzone>
```

Before the component upgrades, that’s an ordinary, usable file field. After it upgrades, the wrapper becomes a drop surface with the prompt “Drop file(s) here,” followed by “or” and the original label.

That last part is important: drag-and-drop is an additional path, not the only path. People can still activate the label and use the operating system’s file picker. Keyboard, touch, switch, and voice input users don’t have to imitate a mouse gesture to upload something.

The wrapper doesn’t add a button role or another tab stop. The file input and label already provide the keyboard interaction, so manufacturing a second control would make the interface more complicated without making it more capable.

## What happens when files are dropped?

When someone drops files onto the enhanced surface, the component:

1. checks each file against the input’s `accept` value,
2. respects whether the input allows `multiple` files,
3. places the accepted files into the input’s `FileList`,
4. dispatches bubbling `input` and `change` events, and
5. announces what was accepted and what was rejected.

Because the accepted files belong to the actual input, they participate in an ordinary form submission and appear in `FormData` just like files chosen through the picker. Your validation and upload code can listen for the same events either way.

A mixed drop doesn’t have to be all or nothing. If someone drops a PDF, a JPEG, and an unsupported executable, the acceptable files remain selected and the rejected one is named in the status message. That’s more useful than silently discarding the entire batch—or, worse, appearing to accept files that will disappear later.

## `accept` is useful, but it isn’t security

The component understands the same comma-separated forms used by the input’s `accept` attribute:

- file extensions, such as `.pdf`
- exact MIME types, such as `application/pdf`
- wildcard MIME groups, such as `image/*`

Using both an extension and a MIME type can make intent clearer across files whose type metadata isn’t especially dependable:

```html
<input
  id="portfolio"
  name="portfolio"
  type="file"
  accept=".pdf,application/pdf,image/*"
  multiple
/>
```

Treat `accept` as guidance and early feedback, not a security boundary. Browsers and files can report incomplete or misleading MIME information, and client-side code can always be bypassed. Your server still needs to verify the type, inspect the contents where appropriate, enforce size limits, generate safe filenames, and decide where the upload may be stored.

`<form-dropzone>` doesn’t add a file-size API. That’s intentional scope, not permission to accept a 14-gigabyte “headshot.” If size matters, communicate the limit near the field, check it before upload for faster feedback, and enforce it again on the server.

## One file means one file

Without `multiple`, the first acceptable dropped file is selected and later acceptable files are rejected. The component announces both outcomes, which gives someone a useful explanation instead of quietly choosing on their behalf.

If the task genuinely supports several files, add `multiple`. Don’t add it merely because the interface can. A tax-return form that expects one signed document shouldn’t turn into a mystery collection because someone dropped their whole Downloads folder.

The same principle applies to `accept`: make it broad enough for legitimate work, but no broader. Requiring a designer to convert a perfectly good PNG to JPEG before uploading doesn’t improve your system; it just transfers work to them.

## Optional previews, not pretend uploads

For image-oriented tasks, `preview-images` adds previews for selected images:

```html
<form-dropzone preview-images>
  <label for="photos">Choose photos</label>
  <input id="photos" name="photos" type="file" accept="image/*" multiple />
</form-dropzone>
```

The previews work for files selected through the picker and files added by dropping. Non-image files can remain selected, but the component won’t try to render them as images.

A preview confirms which file was selected. It does _not_ mean the file has been uploaded. Selection, validation, transfer, processing, and storage are different stages, and interfaces should name them honestly. If uploading starts immediately, provide separate progress and success states tied to the actual network request. If the form still needs to be submitted, keep the submit control and say so.

The component revokes its temporary object URLs whenever previews are replaced, disabled, or removed. That housekeeping isn’t visible, but it keeps a helpful flourish from turning into a resource leak.

## Tell people what happened

Drop outcomes are written to a polite, atomic status region. Accepted files, rejected types, and extra files in a single-file field each have their own message, so partial success doesn’t get flattened into a vague “Something went wrong.”

All of that wording can be adapted:

```html
<form-dropzone
  drop-label="Déposez les fichiers ici"
  separator-label="ou"
  received-message="{count} fichier(s) reçu(s) : {files}."
  rejected-type-message="Type de fichier refusé : {files}."
  rejected-multiple-message="Un seul fichier est autorisé. Refusé : {files}."
>
  <label for="document">Choisir un fichier</label>
  <input id="document" name="document" type="file" accept=".pdf" />
</form-dropzone>
```

The `{files}` token becomes a comma-separated list of filenames and `{count}` becomes the number of files in that part of the result.

Filename announcements can get long, especially when `multiple` is involved. That’s another reason to choose useful constraints instead of accepting everything by default. If your workflow expects dozens of files, consider whether a summarized count and a visible file list would be kinder than reading every name aloud.

## Style the states that matter

The component adds stable Light DOM classes for the enhanced surface, active drag state, status, and previews. You can override the low-specificity defaults with ordinary selectors:

```css
form-dropzone {
  align-items: start;
  min-block-size: 10rem;
  text-align: start;
}

form-dropzone.form-dropzone--drag-active {
  border-color: rebeccapurple;
  background: lavender;
}

form-dropzone .form-dropzone__previews {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

The active state should make the target easier to recognize, but don’t rely on a subtle color change alone. A clear border, background shift, or other visible treatment can help someone track the destination while dragging.

Also remember that dragging a file across nested elements fires a surprising number of enter and leave events. The component handles that bookkeeping so the active style doesn’t flicker every time the pointer crosses the prompt or label. Sometimes the best reusable abstraction is simply the one that absorbs browser weirdness once.

## Progressive enhancement is doing real work here

If the browser doesn’t support the drag-and-drop and assignable `FileList` APIs the component needs, it leaves the label and input alone. If JavaScript fails, it does the same. People lose the drop surface and previews, but they can still choose files and submit the form.

Invalid markup is also left unchanged and reported in the console. That failure mode is preferable to half-enhancing a field and making the dependable path harder to use.

The core best practice is straightforward: build the upload around a native file input, then treat dropping as a convenience. A pointer gesture can make an experience quicker for some people; it shouldn’t make the experience possible only for them.

## Try it out

You can [experiment with the live demo](https://aarongustafson.github.io/form-dropzone/demo/) using single and multiple files, accepted file types, localized messages, and image previews.

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-dropzone/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

The source, documentation, and issue tracker are in [the `<form-dropzone>` repository](https://github.com/aarongustafson/form-dropzone). You can install the package from npm:

```bash
npm install @aarongustafson/form-dropzone
```

For most projects, the guarded definition helper will register `<form-dropzone>`:

```javascript
import "@aarongustafson/form-dropzone/define.js";
```

Use the drop zone when it makes uploading easier. Keep the file field because it makes uploading possible.
