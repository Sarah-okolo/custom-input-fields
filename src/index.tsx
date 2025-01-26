import { useEffect, useRef, useState } from 'react';
import { Controller, Control, FieldValues, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { format } from 'date-fns'
import { CalendarIcon, FileImage } from "lucide-react"
import { FC } from 'react';

// type definition for the all props
interface InputFieldProps {
  depCompFile?: string; 
  wrapperClass?: string;
  label?: string;
  labelExtra?: string | React.ReactNode;
  labelFor: string;
  labelClass?: string;
  placeholder?: string;
  type: string;
  customClass?: string;
  errMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  hasError?: boolean;
  registerInput?: ReturnType<import('react-hook-form').UseFormRegister<any>>;
  fieldErrorStyle?: string;
  focusActiveStyle?: string;
  iconStyles?: {size: number, color: string, strokeWidth: number, fill: string};
  groupInputs?:  { label: string, options: string[] }[] | string[];
  registerControl?: Control<FieldValues>;
  triggerValidation?: (name?: string | string[]) => Promise<boolean>;
  subLabel?: string[];
  subLabelExtra?: React.ReactNode;
  subLabelCustomClass?: string;
  additionalFieldInfo?: string | string[];
  additionalFieldInfoClass?: string;
  optionsCustomClass?: string;
  customDateFormat?: string;
  disabledDates?: boolean | ((date: Date) => boolean);
  preSelectedDate?: Date;
  yearsIntoPast?: number;
  yearsIntoFuture?: number;
  calendarCustomClass?: string;
  dateDropdown?: boolean;
}

const InputField: FC<InputFieldProps> = (props) => {
  const { depCompFile, wrapperClass, label, labelExtra, labelFor, labelClass, placeholder, type, customClass,
          errMsg, hasError, registerInput, fieldErrorStyle, focusActiveStyle, iconStyles,
          groupInputs, registerControl, triggerValidation,
          subLabel, subLabelExtra, subLabelCustomClass, // customClass is for the single/grouper fields, sublabelCustomClass is for only the group field items.
          additionalFieldInfo, additionalFieldInfoClass, optionsCustomClass,
          // Calendar date picker
          customDateFormat, disabledDates, preSelectedDate, yearsIntoPast, yearsIntoFuture,
          calendarCustomClass, dateDropdown
        } = props;
  const singleLineFields = ['text', 'number', 'email', 'password', 'url', 'search', 'tel', 'color'];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [depModule1, setDepModule1] = useState<any>(null); // stores the dependency module(if specified).
  const [depModule2, setDepModule2] = useState<any>(null);


  // Dynamically import the required component for the input field
  useEffect(() => {
    if(depCompFile){
      // imports the specified dependency file
      import(/* @vite-ignore */ `./${depCompFile}`).then((mod) => {
        if (mod) setDepModule1(mod.default || mod);
      }).catch(() => {
        console.warn(`Error: Failed to resolve dependency file '${depCompFile}' for (${labelFor}[${type}]) field. Ensure the file name is correct and it exists in the (src/components/ui) folder.`);
      });

      // If the dependency file is a popover, then import the calendar component as well
      if (depCompFile.includes('popover')) {
        const calendarFile=`./calendar`;
        import(/* @vite-ignore */ calendarFile).then((mod) => {
          if (mod) setDepModule2(mod.default || mod);
        }).catch(() => {
          console.warn(`Dependency for (${labelFor}[${type}]) not found: Ensure the Shadcn calendar component is present in the(src/components/ui) folder.`);
        });
      }
    }
  }, [depCompFile]);


  // Shortens a string to a specified number of characters
  const shortenString = (str: string, num: number): string => {
    if (str.length <= num*2) {
      return str;
    }
    const halves = num / 2; // Number of characters to show in each half
    const firstPart = str.slice(0, halves); // Get the first N characters
    const lastPart = str.slice(-halves);    // Get the last N characters
    return `${firstPart}.....${lastPart}`;
  }


  return (
    <>
      <div className={`mb-5 ${wrapperClass}`}>
        { label && <label htmlFor={labelFor} className={labelClass}>{label} {labelExtra}</label> }
        {
        type && singleLineFields.includes(type) ?
          <input {...registerInput} type={type} id={labelFor} name={labelFor} placeholder={placeholder} className={`${customClass} ${hasError ? fieldErrorStyle : ''}`}/>
        :
        type === 'textarea' ?
          <textarea {...registerInput} id={labelFor} name={labelFor} placeholder={placeholder} className={`${customClass} ${hasError ? fieldErrorStyle : ''}`} /> 
        :
        type === 'radioGroup' && depModule1 ? // Is structured like this cause it requires only one of the radio to be selected
          <Controller
            name={labelFor}
            control={registerControl}
            render={({ field }) => (
              <depModule1.RadioGroup {...field} className={customClass} onValueChange={(value: any) => field.onChange(value)}>
                {
                  subLabel?.map((radioSubLabel, index) => (
                    <label key={index} className={`${subLabelCustomClass} ${field.value === groupInputs?.[index] ? focusActiveStyle : ""}`}>
                      <depModule1.RadioGroupItem value={groupInputs ? groupInputs[index] : ''} id={labelFor} />
                      <div className="inline">
                        <span className="ml-4 relative bottom-[1px]">{radioSubLabel} {subLabelExtra}</span>
                        {additionalFieldInfo && additionalFieldInfo[index] ? <span className={additionalFieldInfoClass}>{additionalFieldInfo[index]}</span> : null }
                      </div>
                    </label>
                  ))
                }
              </depModule1.RadioGroup>
            )}
          />
        :
        type === 'checkboxGroup' && depModule1 ? // It's structured like this cause it requires at least one box to be checked
          <div className={customClass}>
            {
              subLabel?.map((checkboxSubLabel, index) => (
                <Controller 
                  key={index}
                  name={`${labelFor}[${groupInputs?.[index]}]`}
                  control={registerControl}
                  render={({ field }) => (
                    <label className={`${subLabelCustomClass} ${field.value ? focusActiveStyle : ""}`}>
                      <depModule1.Checkbox 
                        {...field} 
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          triggerValidation && triggerValidation(labelFor)
                        }}
                      />
                      <div className="inline">
                        <span className="ml-4 relative bottom-[3px]">{checkboxSubLabel} {subLabelExtra}</span>
                        {additionalFieldInfo && additionalFieldInfo[index] ? <span className={additionalFieldInfoClass}>{additionalFieldInfo[index]}</span> : null }
                      </div>
                    </label>
                  )}
                />
              ))
            }
          </div>
        :
        type === 'dropdown' && depModule1 && Array.isArray(groupInputs) && groupInputs.every(item => typeof item === "object" && item !== null)
        ?
          <Controller
            name={labelFor}
            control={registerControl}
            render={({ field }) => (
              <depModule1.Select onValueChange={(value: any) => field.onChange(value)}>
                <depModule1.SelectTrigger className={customClass} id={labelFor}>
                  <depModule1.SelectValue placeholder={placeholder} />
                </depModule1.SelectTrigger>
                <depModule1.SelectContent>
                  {
                    groupInputs.map((group, index) => (
                      <depModule1.SelectGroup key={index}>
                        <depModule1.SelectLabel className={subLabelCustomClass}>{group.label}</depModule1.SelectLabel>
                        {
                          group.options.map((option, index) => (
                            <depModule1.SelectItem key={index} value={option} className={optionsCustomClass}>{option}</depModule1.SelectItem>
                          ))
                        }
                      </depModule1.SelectGroup>
                    ))
                  }
                </depModule1.SelectContent>
              </depModule1.Select>
            )}
          />
        :
        type === 'datePicker' && depModule1 ?
          <Controller
            name={labelFor}
            control={registerControl}
            render={({ field }) => {
              useEffect(() => {
                if (preSelectedDate) 
                  field.onChange(preSelectedDate)
              }, [preSelectedDate]) // Sets the field value to the pre-selected date(if provided) on render
              return (
                <depModule1.Popover>
                  <depModule1.PopoverTrigger className={`flex gap-3 p-3 border-2 border-input bg-background  ${customClass} ${!field.value && "text-muted-foreground"}`} id={labelFor}>     
                    <CalendarIcon {...iconStyles}/>
                    {field.value ? format(field.value, `${customDateFormat ? customDateFormat : 'PPP'}`) : <span>{placeholder}</span>}
                  </depModule1.PopoverTrigger>
                  <depModule1.PopoverContent className={`w-auto p-3 my-1 ${calendarCustomClass}`}>
                    { depModule2 &&
                      <depModule2.Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date: Date) => {field.onChange(date)}}
                        disabled={disabledDates}
                        initialFocus
                        captionLayout={dateDropdown ? "dropdown-buttons" : "label"}
                        fromYear={new Date().getFullYear() - (yearsIntoPast ? yearsIntoPast : 120)}
                        toYear={new Date().getFullYear() + (yearsIntoFuture ? yearsIntoFuture : 0)}
                        classNames={{
                          caption: 'flex justify-center relative items-center pb-2 pt-2',
                          caption_label: dateDropdown ? "hidden" : "",
                          caption_dropdowns: 'flex justify-center items-center opacity-90 mx-2',
                          dropdown: 'bg-background bg-Background focus:outline-none hover:opacity-70 font-medium px-1',
                          dropdown_month: 'text-last-right text-left mr-1',
                          dropdown_year: 'text-last-right text-left mr-1',
                          vhidden: 'hidden',
                        }}
                      />
                    }
                  </depModule1.PopoverContent>
                </depModule1.Popover>
              )
            }}
          />
        :
        type === 'file-image' ?
          <Controller
            name={labelFor}
            control={registerControl}
            render={({ field }) => (
              <div>
                <input 
                  type="file" 
                  accept=".png, .jpg, .jpeg"
                  ref={fileInputRef} 
                  id={labelFor}
                  style={{ display: 'none' }} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) { field.onChange(file) }
                  }}
                />
                <button 
                  type='button'
                  onClick={() => fileInputRef.current && fileInputRef.current.click()} 
                  className={`border p-4 flex items-center gap-2 transition ${customClass}`}
                >
                  <FileImage {...iconStyles}/>
                  {field.value ? shortenString(field.value.name, 20) : placeholder}
                </button>
              </div>
            )}
          />
        :
          null
        }
        { hasError && <p className="text-red-500 text-sm">{errMsg?.toString()}</p> }
      </div>
    </>
  )
}

export default InputField