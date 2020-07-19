import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  forwardRef,
  ChangeDetectorRef, OnDestroy, Input
} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-tolerant-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('dateInput', { static: true }) dateInput: ElementRef;

  @Input() maxDate: Date;
  @Input() minDate: Date;

  isDisabled: boolean;

  get value(): string | Date {
    return this._value;
  }

  set value(value: string | Date) {
    this._valid = this._isValueValidAsDate(value);
    this._value = this._valid ? new Date(value) : value;

    this._changeDetectorRef.markForCheck();
  }

  get valid(): boolean {
    return this._valid;
  }

  private _value: string | Date;
  private _valid = true;

  private _onChangeCallback = (value: string | Date) => {};
  private _onTouchedCallback = () => {};

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }


  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: string | Date, isModelUpdated?: boolean): void {
    this.value = value;
  }

  pickerInputChange({ target }: Event): void {
    this._setValue((target as HTMLInputElement).value);
  }

  pickerDateChange({ value }: MatDatepickerInputEvent<Date>): void {
    this._setValue(value);
  }

  erroneousPickerInputChange(event: Event): void {
    this.pickerInputChange(event);
  }

  private _setValue(value: string | Date): void {
    this.value = value;
    this._onChangeCallback(this.value);
  }

  private _isValueValidAsDate(value: string | Date): boolean {
    return new Date(value).toString() !== 'Invalid Date';
  }
}
