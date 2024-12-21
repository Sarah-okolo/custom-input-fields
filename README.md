# InputField Component Props Usage

This doc describes how to make use of the right props in the **<InputField />** component to create and validate various form fields. The props are marked with their **[data type]** and **(*required*\* or *optional?*)** tag.

*All fields validation are registered using **Zod** and **React Hook Forms(RHF)**. All styling is done with **tailwindcss**, custom fields are created using **Shadcn UI***, icons are created using **lucide-react**, dates are created using **date-fns**


## General Props
These are props that can be used in any of the fields.

- **type** - [string] (***required\****) - Used to specify the type of input field to render. Takes in any of the following:
    - *text* | *email* | *password* | *number* | *search* | *url* | *color* | *tel* | *textarea* | *radioGroup* | *checkboxGroup* | *dropdown* | *datePicker* | *file-image*

- **wrapperClass** - [string] (***optional?***) - Receives a string of tailwind classes for styling the element that wraps the entire field which includes the (label, field(s), error).

- **labelFor** - [string] (***required\****) - Receives the name of the field's validation rule in the zod schema.

- **hasError** - [boolean] (***required\****) Receives a boolean value which specifies if the field has an error.

- **errMsg** - [string] (***required\****) Receives the error message from the field's zod validation rule.

- **customClass** - [string] (***optional?***) - Receives a string of tailwind classes that would be used to style the structure of a single or group input field.

## Basic fields
*text* | *email* | *password* | *number* | *search* | *url* | *color* | *tel* | *textarea* 
Below are all the accepted valid props to create and style the basic input fields.

```jsx
<InputField
  type=''
  wrapperClass=''
    
  label='' //[string] (required*) - To display label for the field
  labelFor='zodFieldName'
  labelExtra='' | {<span></span>} // [string or span element] (optional?) - To add extra info by side of the label
  labelClass='' // [string] (optional?) - For styling the label

  placeholder='' // [string] (optional?) // To display a placeholder for the field
  customClass=''
    
  registerInput={register('zodFieldName')} // [function] (required*) Registers the field to RHF.
  errMsg={errors.zodFieldName?.message}
  hasError={!!errors.zodFieldName}
  fieldErrorStyle='border-red-800' // [string] (optional?) For styling the input field's error state
/>
```


## Custom fields
| *radioGroup* | *checkboxGroup* | *dropdown* | *datePicker* | *file-image*
These are fields that requires extra customization.

### radio buttons
To use, install the **radio-group** component from Shadcn.

Below are all the accepted valid props to create and style the *radioGroup* field.
```jsx
<InputField
    type='radioGroup' // To create a new group of radio buttons
    depCompFile='radio-group.jsx' // [string] (Required*) - For passing the field's dependency file.(can also be passed without the file extention)
    wrapperClass=''

    label='' //[string] (optional?) - To display a label for the group
    labelFor='zodFieldName'
    labelExtra='' | {<span></span>} // [string or span element] (optional?) - To add extra info by side of the label
    labelClass='' // [string] (optional?) - For styling the group label
    
    
    customClass=''
    focusActiveStyle='' // [string] (optional?) - Used to style the focus state of the radios in the group.
    
    subLabel={['radio1', 'radio2', ...]} // [array of strings] (required*) - Used to create individual radio buttons in the group
    subLabelExtra='' | {<span></span>} // [string or span element] (optional?) - To add a general extra info by the side of the sublabel for all the radios in the group.
    subLabelCustomClass='' // [string] (optional?) - Used to style the individual radio buttons.
    
    additionalFieldInfo={['radio1SubInfo', 'radio2SubInfo', ...]} // [array of strings] (optional?) - Used to create an additional info for each of the radios. Pass an empty string '' to the index of the radio which you don't want an additional info for.
    additionalFieldInfoClass='' // [string] (optional?) - Used to style the additional info text
    
    groupInputs={['option 1', 'option 2']} // [array of strings] (required*) - Used to register each of the radios to the group's zod validation.
    registerControl={control} // [object] (required*) Registers the field to RHF using the custom control object.
    errMsg={errors.zodFieldName?.message}
    hasError={!!errors.zodFieldName}
/>
```

**radioGroup field zod validation structure**:
```jsx
 zodFieldName: z.enum(['option 1', 'option 2'], {required_error: 'Your error message goes here'}),
// Ensures one of the radio buttons in the group is selected
```

### checkboxes
To use, install the **checkbox** component from Shadcn.

Below are all the accepted valid props to create and style the *checkboxGroup* field.
```jsx
<InputField
    type='checkboxGroup' // To create a new group of checkboxes
    depCompFile='checkbox.jsx' // [string] (Required*) - For passing the field's dependency file.(can also be passed without the file extention)
    wrapperClass=''
    
    label='' //[string] (optional?) - To display a label for the group
    labelFor='zodFieldName'
    labelExtra='' | {<span></span>} // [string or span element] (optional?) - To add extra info by the side of the label
    labelClass='' // [string] (optional?) - For styling the group label
    
    customClass=''
    focusActiveStyle='' // [string] (optional?) - Used to style the focus state of the checkboxes in the group.
    
    subLabel={['This is checkbox1', 'This is checkbox2']} // [array of strings] (required*) - Used to create the individual checkboxes in the group
    subLabelExtra='' | {<span></span>} // [string or span element] (optional?) - To add a general extra info by the side of the sublabel for all the checkboxes in the group.
    subLabelCustomClass='' // [string] (optional?) - Used to style the individual radio buttons.
    
    additionalFieldInfo={['checkbox!SubInfo', 'checkbox2SubInfo', ...]} // [array of strings] (optional?) - Used to create an additional info for each of the checkboxes. Pass an empty string '' to the index of the checkbox which you don't want an additional info for.
    additionalFieldInfoClass='' // [string] (optional?) - Used to style the additional info text.
    
    groupInputs={['checkbox1', 'checkbox2', ...]} // [array of strings] (required*) - Used to register each of the checkboxes to the group's zod validation.
    registerControl={control} // [object] (required*) Registers the field to RHF using the custom control object.
    errMsg={errors.zodFieldName?.message}
    hasError={!!errors.zodFieldName}
    triggerValidation={trigger} // [object] (required*) Used to trigger validation as the boxes are checked and unchecked using RHF and its custom trigger object.
  />
```

**checkboxGroup field zod validation structure**:
```jsx
zodFieldName: z.object({
    checkbox1: z.boolean(),
    // ... additional checkboxes in same style.
  }).refine((data) => Object.values(data).some(Boolean), {
    message: 'Your validation error message goes here',
  }),
//  Ensures at least one of the checkboxes in the group is checked
```

### select dropdown
To use, install the **select** component from Shadcn.

Below are all the accepted valid props to create and style the *dropdown* field.
```jsx
<InputField
    type='dropdown' // To create a new select dropdown.
    depCompFile='radio-group.jsx' // [string] (Required*) - For passing the field's dependency file.(can also be passed without the file extention)
    wrapperClass=''
    
    label='' //[string] (optional?) - To display a label for the select display box
    labelFor='zodFieldName'
    labelExtra='' | {<span></span>} // [string or span element] (optional?) - To add extra info by the side of the label
    labelClass='' // [string] (optional?) - For styling the label
    
    placeholder='' // [string] (required*) - For setting a placeholder text in the select display box.
    customClass=''
    
    groupInputs={[
      {
        label: 'Weekdays', // [string] (optional?) sets the label for a group of options in the dropdown
        options: ['', '', ...] // [array of string] (required*) sets the options for the group in the dropdown.
      },
      ...
    ]} // [array of objects] (required*) - For creating the options or group of options in the dropdown.
    
    subLabelCustomClass='' // [string] (optional?) - For styling the label of the group options in the dropdwon.
    optionsCustomClass='' // [string] (optional?) - For styling the options in the dropdown
    
    registerControl={control} // [object] (required*) - Registers the field to RHF using the custom control object.
    errMsg={errors.zodFieldName?.message}
    hasError={!!errors.zodFieldName}
  />
```

**dropdown field zod validation structure**:
```jsx
zodFieldName: z.string({ required_error: 'Your validation error message goes here' }),
// Ensures an option is selected from the dropdown
```

### date pickers
To use, install both the **popover** and **calendar** components from Shadcn.

Below are all the accepted valid props to create and style the *datePicker* field.
```jsx
<InputField
    type='datePicker' // To create a new date display box and popover calendar
    depCompFile='popover.jsx' // [string] (Required*) - For passing the field's dependency file.(can also be passed without the file extention). *pass only 'popover.jsx', never 'calendar.jsx'*
    wrapperClass=''
    
    label='' //[string] (optional?) - To display a label for the date display box
    labelFor='zodFieldName'
    labelExtra='' | {<span></span>} // [string or span element] (optional?) - To add extra info by the side of the label
    labelClass='' // [string] (optional?) - For styling the label
    
    placeholder='' // [string] (required*) - For setting a placeholder text in the date display box.
    customClass=''
    iconStyles={{ fill: '', size: n, ...}} // [object] (optional?) - For styling the file icon in the date display box.
    calendarCustomClass='' // [string] (optional?) - For adding custom styling to the body of the calendar
    
    dateDropdown={true} // [boolean] (optional?) - For adding a dropdown to the month and year in the calendar. If prop is not added, defaults to false.
    customDateFormat='dd MMM yyyy' // [string] (optional?) - Presents the date in the specified date-fns format type. Defaults to 'PPP' if prop is not specified.
    disabledDates= {(date) => date < new Date()}  // [date | function | boolean] (optional?) - For disabling selection of certain dates in the calendar.  Set to true to disable all dates except the preSelectedDate(if provided). Defaults to false(doesn't disable any date) if prop is not added.
    preSelectedDate={new Date('')} // [date] (optional?) - For setting a default selected date in the calendar.
    yearsIntoPast = {n} // [number] (optional?) - Tells the calendar how many years into the past its allowed to access. Defaults to (120)years if prop is not added.
    yearsIntoFuture = {n} // [number] (optional?) - Tells the calendar how many years into the future its allowed to access. Defaults to (0)years (stops at current year) if prop is not added.
    
    registerControl={control} // [object] (required*) - Registers the field to RHF using the custom control object.
    errMsg={errors.zodFieldName?.message}
    hasError={!!errors.zodFieldName}
  />
```

<span style='color:green'>**Recommended**</span>:
Add the following code to your `index.css` file to allow for better alignment of the month caption label in the calendar.
```css
@layer utilities {
  .text-last-right {
    text-align-last: right;
  }
}
```

**datePicker field zod validation structure**:
```jsx
zodFieldName: z.date({ required_error: 'Your validation error message goes here' }),
// Ensures a date is selected
```

### image file upload
Below are all the accepted valid props to create and style the *file-image* field.
```jsx
<InputField
    type='file-image' // To create a new image file upload box
    wrapperClass=''
    
    label='' //[string] (optional?) - To display a label for the upload box
    labelFor='zodFieldName'
    labelExtra='' | {<span></span>} // [string or span element] (optional?) - To add extra info by the side of the label
    labelClass='' // [string] (optional?) - For styling the label
    
    placeholder='' // [string] (required*) - For setting a placeholder text in the upload box.
    customClass=''
    iconStyles={{ fill: '', size: n, ...}} // [object] (optional?) - For styling the file icon in the upload box.
    
    registerControl={control}  // [object] (required*) - Registers the field to RHF using the custom control object.
    errMsg={errors.zodFieldName?.message}
    hasError={!!errors.zodFieldName}
/>
```

**file-image field zod validation structure**:
```jsx
zodFieldName: z.custom((value) => value instanceof File, { message: "Your validation message here" }),
// Ensures an image is uploaded
```