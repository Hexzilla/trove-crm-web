export interface TIMEZONES {
  id: number;
  zones: string;
  value: string
  abbr: string
  utc: string
  offset: string
  status: number
  created_at: string
  updated_at: string
  }

  export interface TIMEFORMATS {
  id: number;
  timeformat: string
  status: number
  created_at?: string
  updated_at: string
  }

  export interface DATEFORMATS {
  id: number
  dateformat: string
  status: number
  created_at?: string
  updated_at?:string
  }

  export interface CURRENCYFORMATS {
  id: number;
  name: string
  symbol: string
  symbol_native: string
  decimal_digits: number
  code: string
  status: number
  created_at: string
  updated_at: string
  }

  export interface PREFERENCEDATA {
    id:	number
    user_id: number
    timezone_id: number
    currency_id: number
    timeformat_id: number
    dateformat_id: number
    status:	number
    created_at:	string
    updated_at:	string
  }
