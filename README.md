# React JSONSchema Form Layout: Supercharge Your RJSF Experience!

Reclaim full layout control. Want to dive fast? Check this [complete example here](https://github.com/aularon/rjsf-layout-example-nextjs).

## Installation

```sh
npm install rjsf-layout
```

## Basic Usage: Free Layouts

```tsx
import Form, { Field } from "rjsf-layout";

<Form {...{ schema, validator }}>
  <div className="flex">
    <Field name="firstName" />
    <Field name="lastName" />
  </div>
  <div>
    <Field name="password" />
  </div>
</Form>;
```

## The Type System: Typed Fields and Data

The above is enough to conceive any complex layout! But that's only the basic offering. Check the [Next.js Example](https://github.com/aularon/rjsf-layout-example-nextjs) for a fully fledged example, or continue reading to learn how `rjsf-layout` leverages Typescript to provide more features that makes it easier, cleaner, and safer to create RJSF forms! The sections below explore different features accumulatively.

### Type-safe Field Components

Used in the way below, `Field` is a typed field component. Similar to the untyped variant in the first example, it allows you to display fields at any point in the components tree. This version is typed, however, in that it provides typing for the `name` prop, and other features for nested trees.

```tsx
<Form {...{ schema, validator }}>
  {({ Field }) => (
    // ^
    <>
      <div className="flex">
        <Field name="firstName" />
        <Field name="lastName" />
      </div>
      <div>
        <Field name="password" />
        <Field name="nonExistingField" />
        {/* ^ Error */}
      </div>
    </>
  )}
</Form>
```

In addition to having autocomplete for the `name` prop, non-existing fields show TS errors.

### Named Fields

Automatically populated, typed, field components. `<FirstName />` below is equivalent to `<Field name="firstName" />`.

```tsx
<Form {...{ schema, validator }}>
  <Field name="fieldName" />
  {({ FirstName, LastName, Password }) => (
    <>
      <div className="flex">
        <FirstName />
        <LastName />
      </div>
      <div>
        <Password />
      </div>
    </>
  )}
</Form>
```

### Typed `formData`

You receive a typed `formData` object. Type is inferred from the incoming `schema`.

```tsx
<Form {...{ schema, validator }}>
  <Field name="fieldName" />
  {({ formData, FirstName, LastName }) => (
    // ^
    <>
      <h1>
        Hello, {formData.firstName} {formData.lastName}!
      </h1>
      <div className="flex">
        <FirstName />
        <LastName />
      </div>
    </>
  )}
</Form>
```

### Expanded `formData`

Instead of `formData`, you can pick individual variables. These are automatically populated, with proper types, based on your `schema`!

```tsx
<Form {...{ schema, validator }}>
  <Field name="fieldName" />
  {({ $firstName, $lastName }) => (
    // ^
    <>
      <h1>
        Hello, {$firstName} {$lastName}!
      </h1>
      ...
    </>
  )}
</Form>
```

## More Goodies

### Embedded `FieldTemplate`

Say you have a boolean `done` field where you want to have a custom toggle-style checkbox. You can simply do this:

```tsx
<Done>
  {({ $done, setDone }) => (
    // $done is a typed boolean, and setDone takes a boolean arguments — as inferred from the `schema`
    <span
      onClick={() => setDone(!$done)}
      style={{
        color: $done ? "green" : "gray",
      }}
    >
      {$done ? "🗹" : "☐"}
    </span>
  )}
</Done>
```

### Complex Nested Schemas? We've Got You Covered.

```tsx
const schema = {
  type: "object",
  properties: {
    name: {
      type: "object",
      properties: {
        first: { type: "string" },
        last: { type: "string" },
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          language: {
            type: "string",
            enum: [
              "arabic",
              "chinese",
              "english",
              "french",
              "russian",
              "spanish",
            ],
          },
          level: {
            type: "number",
            enum: [1, 2, 3],
          },
        },
      },
    },
  },
} as const satisfies JSONSchemaObject;

<Form schema={schema} validator={validator}>
  {({ $name, $languages, Name, Languages }) => (
    <>
      {$name &&
        `Hello ${$name.first || ""} ${$name.last || ""}. You know ${
          $languages?.length || 0
        } languages!`}
      <Name />
      {/* ^ If you do not pass in a nested layout, it will fallback to RJSF default rendering of that field*/}
      <Languages>
        {({ Language, Level, $level }) => (
          // Custom array item layout
          <div
            className="flex"
            style={{
              backgroundColor:
                // $level is typed to be `1 | 2 | 3 | undefined`
                $level === 1
                  ? "lightgreen"
                  : $level === 2
                  ? "lightblue"
                  : "pink",
            }}
          >
            <Language />
            <Level />
          </div>
        )}
      </Languages>
    </>
  )}
</Form>;
```

### Custom themes?

```tsx
import { Theme } from "@rjsf/mui"; // Or any other

<Form theme={Theme} {...{ otherProps }}>
  ...
</Form>;
```

### Custom Submit Button?

Usually, custom submit buttons are passed in as `children` of the default RJSF `Form` implementation. Since we repurpose that to provide layout, you can pass any custom submit button in the `submitter` prop:

```tsx
<Form
  {...{ otherProps }}
  submitter={
    <div>
      <CustomSubmit />
    </div>
  }
>
  ...
</Form>
```

## Background, (Brief) History & Acknowledgement

An earlier private version of this was created for a personal (production stage) project around a year ago (RJSF v4). It was more of an exploration/proof of concept. It helped great deal in expressing complex forms and managing them, and reducing development and maintenance time.

Ever since RJSF v5 was released I intended to rewrite what I have in a more-reusable fashion. I had first working version a few months ago and used it in another personal project, but still wanted to achieve more elaborate features before declaring it public-ready. And here we are!

Last feature I included was typing the data variables. I tried with [`ajv`'s `JTDDataType`](https://ajv.js.org/guide/typescript.html) before settling on the excellent [`json-schema-to-ts`](https://www.npmjs.com/package/json-schema-to-ts).
