---
title: "Drag and Drop without Leaving Anyone Behind"
date: 2026-10-14 18:04:34 +00:00
last_updated_at: 2026-11-25 20:03:33 +00:00
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
description: "Inspired by Nikita Hlopov’s file-input styling approach, I built a web component that adds drag-and-drop and optional image previews to a native file field."
twitter_text: "I built a drag-and-drop file component around a native file input, inspired by Nikita Hlopov’s approach."
---

Nikita Hlopov’s article, [“Custom styled input type file”](https://nikitahl.com/custom-styled-input-type-file), takes an approach to file fields that I really like: keep the native input and its label, then build the drop zone around them. I wanted to make that approach reusable, so I built [`<form-dropzone>`](https://github.com/aarongustafson/form-dropzone).

Dragging a file onto a page is handy when you already have it in front of you. Having to drag it, on the other hand, is a problem. The component adds that convenience without taking away the file picker, along with feedback about dropped files and optional image previews.

<!-- more -->

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

You can still use the file picker, whether you’re working with a keyboard, touch, voice input, or something else. Clicking the drop surface opens it too, unless you’re clicking another interactive control. I haven’t given the wrapper a button role or a tab stop; the file input already does that job.

## What happens when files are dropped?

When someone drops files onto the enhanced surface, the component:

1. checks each file against the input’s `accept` value,
2. respects whether the input allows `multiple` files,
3. places the accepted files into the input’s `FileList`,
4. dispatches bubbling `input` and `change` events, and
5. announces what was accepted and what was rejected.

Because the accepted files belong to the actual input, they participate in an ordinary form submission and appear in `FormData` just like files chosen through the picker. Your validation and upload code can listen for the same events either way.

For example, with the markup above, you could drop a PDF, a JPEG, and an executable. The PDF and JPEG would be selected, and the component would announce that it rejected the executable. Without `multiple`, it would keep only the first acceptable file and explain that the others weren’t selected.

Dropping acceptable files replaces any previous selection, just as choosing a new batch in the picker does. If nothing in the drop is acceptable, though, the existing selection stays put. I wouldn’t want an unsuccessful attempt to add a file to wipe out the ones you’d already chosen.

### A note about `accept`

For drops, the component checks the input’s [`accept` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept). It understands extensions like `.pdf`, MIME types like `application/pdf`, and groups like `image/*`. Files chosen through the picker still follow the browser’s native behavior; the component’s rejection messages apply to drops.

You can combine these when file metadata might be incomplete:

```html
<input
  id="portfolio"
  name="portfolio"
  type="file"
  accept=".pdf,application/pdf,image/*"
  multiple
/>
```

Bear in mind that these checks are for feedback, not security. File metadata can be wrong, and someone can bypass client-side checks altogether. You still need to validate uploads on the server.

The component doesn’t impose a file-size limit either. If your form has one, explain it near the field and enforce it on the server too.

## Want image previews?

For image-oriented tasks, `preview-images` adds previews for selected images:

```html
<form-dropzone preview-images>
  <label for="photos">Choose photos</label>
  <input id="photos" name="photos" type="file" accept="image/*" multiple />
</form-dropzone>
```

The previews work for files selected through the picker and files added by dropping. Non-image files can remain selected, but the component won’t try to render them as images.

A preview is useful confirmation that you chose the right image, but it doesn’t mean the image has been uploaded. This component handles file selection, not the network request. If your form uploads immediately, you’ll need to provide progress and confirmation separately.

The component cleans up the temporary object URLs when it no longer needs them. Resetting the form clears the previews and old drop feedback too, unless you’ve canceled the reset. Choosing files through the picker clears the previous drop feedback as well.

## Tell people what happened

If some files were selected and others weren’t, people need to know which was which. The component announces those results using a polite live region, with separate messages for accepted files, rejected types, and extra files dropped onto a single-file field.

You can change all that wording. Here’s a French example:

```html
<form-dropzone
  lang="fr"
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

If you’re expecting dozens of files, reading all those names aloud could get tiresome. You might prefer a count in the announcement and a visible list people can review.

### Shared wording and plural forms

**A release note before we go further:** as of November 25, the shared-message and drop-event features below are in the repository, but not yet in the npm package (1.0.3). You’ll need the repository source to try them for now.

With several drop zones on a page, repeating the same messages on every field gets tedious. You can now set the wording once, in a JSON script before the components:

```html
<script type="application/json" data-form-dropzone-config>
  {
    "drop-label": "Drop documents here",
    "received-message": {
      "one": "Received one file: {files}.",
      "other": "Received {count} files: {files}."
    }
  }
</script>
```

Here, the accepted-file message has two forms, so someone dropping one file doesn’t get “Received 1 files.” The component uses [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) and the inherited `lang` to choose among the phrases you supply. `other` is required; you can add the other plural forms your language needs. You still write the translations.

An attribute on an individual drop zone takes precedence over the shared wording, so you can make an exception without copying everything. If you change the JSON after the components have loaded, call `refresh()` on each affected instance. That updates the wording in place without clearing someone’s files or moving their focus. It returns `false` and logs the problem if it can’t apply the change. You can also read `enhanced` to check whether a drop zone is active.

### Make rejection feedback visible too

The generated live region is visually hidden, so it won’t help someone who needs to _see_ which files were rejected. For that, the new `form-dropzone:drop` event gives you the input and three lists of files: `accepted`, `rejectedType`, and `rejectedMultiple`. You can use those to write a message alongside the field.

There’s a distinction worth keeping in mind: those lists describe the drop, not necessarily what’s selected now. If the entire drop was rejected, `accepted` will be empty, but the input will still have any files selected earlier.

Keep listening to the input’s native events for selection and upload behavior. This extra event reports completed drops, including rejected ones; it doesn’t fire when someone uses the picker or resets the form. The [event documentation](https://github.com/aarongustafson/form-dropzone#drop-outcomes) has the full details.

## Style the states that matter

The styles use ordinary classes in the light DOM, so there’s no shadow root to work around. For example, you could left-align the field, give the active drop target a different background, and put the previews in two columns:

```css
form-dropzone {
  align-items: start;
  min-block-size: 10rem;
  text-align: start;
}

form-dropzone.form-dropzone--drag-active {
  border-color: rebeccapurple;
  background: lavender;
  color: #222;
}

form-dropzone .form-dropzone__previews {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

By default, the boundary changes from dashed to solid while a file is being dragged over it. That gives you a cue beyond a color change. The example above adds a background and a matching foreground; you’ll want to check those colors, along with the native input’s focus indicator, in your own page and in forced colors.

The component also keeps track of drag events across nested elements. Without that bookkeeping, crossing the prompt or label can make the active style flicker even though you haven’t left the drop zone.

## And without JavaScript?

You still have the label and file input you started with. The same is true if the browser lacks the file drag-and-drop APIs or won’t let the script assign files to the input. There’s no drop surface or preview, but you can choose files and submit the form.

If the component can’t find the expected input and label, it leaves the markup alone and reports the problem in the console.

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

Remember that the shared messages and drop event described above need the newer repository source until the next npm release. If you give the component a try, I’d love to hear how it works with your forms.
