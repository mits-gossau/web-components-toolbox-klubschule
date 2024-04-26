# input

> Generic Input Component

- [JIRA](https://jira.migros.net/browse/MIDUWEB-648)
- [Figma](https://www.figma.com/file/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?type=design&node-id=108-4915&mode=design&t=QcKP4dkU2ckPBYSI-0)
- [Example](../../pages/Input.html)

## CMS Integration

### Variations (check out example page above):
- *Required*: Add attribute `required` to `input` and add asteric `*` after the label text.
- *Placeholder*: Add attribute `placeholder` with the text to the `input`.
- *Hint*: Hint message is displayed in a `div` with the class `hint` and a `span` for the text.
- *Counter*: Add additional `div` with class `counter` and two spans into the hint containter. Add also attribute `maxlenght` to the `input`.
- *Password*: Use type `password` on the input.
- *E-Mail*: Use type `email` on the `input` and the attribute `pattern` with the regex for email validation: `[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+`.
- *Disabled*: Add attribute `disabled` to the `input`.
- *Error*: Add `div` with class `error` and two children (`a-icon-mdx` and `span` for the error text).
- *Textarea*: Use the `textarea` element instead of the `input`.