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
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, skip, startWith, takeUntil} from 'rxjs/operators';
import {DatePickerValue} from './datepicker.interfaces';

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
  @Input() maxDate: Date;
  @Input() minDate: Date;

  isDisabled: boolean;

  get value(): string | Date {
    return this._value;
  }

  set value(value: string | Date) {
    this._valid = this._isValueValid(value);
    this._validAsDate = this._isValuePotentialDate(value);
    this._value = this._validAsDate ? new Date(value) : value;

    this._changeDetectorRef.markForCheck();
  }

  get valid(): boolean {
    return this._valid;
  }

  get validAsDate(): boolean {
    return this._validAsDate;
  }

  private _value: DatePickerValue = null;
  private _valid = true;
  private _validAsDate = true;


  private _valueSubscription: Subscription;
  private readonly _value$: BehaviorSubject<DatePickerValue>;
  private readonly _destroyed$: Subject<void>;

  private _onChange = (value: DatePickerValue) => {};
  private _onTouched = () => {};

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this._valueSubscription = new Subscription();
    this._value$ = new BehaviorSubject(null);
    this._destroyed$ = new Subject();
  }

  ngOnInit(): void {
    this._subscribeOnValue();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: DatePickerValue, isModelUpdated?: boolean): void {
    this._value$.next(value);
  }

  setValue(value: string | Date): void {
    this.writeValue(value);
  }

  private _subscribeOnValue(): void {
    this._valueSubscription = this._value$
      .pipe(
        skip(2),
        distinctUntilChanged(),
        takeUntil(this._destroyed$)
      )
      .subscribe(value => {
        this.value = value;
        this._onChange(this.value);
      });
  }

  private _isValuePotentialDate(value: DatePickerValue): boolean {
    if (!value) {
      return true;
    }

    return value instanceof Date && !isNaN((value as Date).getTime());
  }

  private _isValueValid(value: DatePickerValue): boolean {
    if (!this._isValuePotentialDate(value)) {
      return false;
    }

    return (this.minDate ? value >= this.minDate : true) && (this.maxDate ? value <= this.maxDate : true);
  }
}
