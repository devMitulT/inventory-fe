interface Booking {
  start: string;
  end: string;
  text: string;
  products: {
    productId: string;
    deliveryDate: Date;
    returnDate: Date;
    price: number | string;
  }[];
  id: string;
}

interface Bookings {
  _id: string;
  productId: [number];
  startDate: string;
  endDate: string;
  notes: string;
  depositeAmount: number;
  advancePayment: number;
  rentelReason: string;
  customer: Customer;
  rentalType?: string;
  postalCode: string;
  amount: number;
}

interface Q {
  type: number | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  phoneNumberPrimary: string;
}

interface Customer {
  customerName: string;
  phoneNumberPrimary: string;
  phoneNumberSecondary: string;
}

interface Query {
  product_id: string | undefined;
  month: string | undefined;
  year: string | undefined;
}

interface Query {
  product_id: string | undefined;
  month: string | undefined;
  year: string | undefined;
}

interface Q {
  type: number | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  phoneNumberPrimary: string;
}

// user api
interface Response<T> {
  data: T;
  message: string;
}

// User sign in

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  token: string;
}

// tomorrow departures
interface Customer {
  _id: string;
  customerName: string;
  phoneNumberPrimary: string;
  phoneNumberSecondary: string;
}

interface Rental {
  _id: string | string;
  productId: string[];
  customer: Customer;
  notes: string;
  amount: number;
  startDate: string; // ISO string format for date
  endDate: string; // ISO string format for date
  isDeleted: boolean;
  advancePayment: number;
  rentalType: string;
  organizationId: string;
  createdAt: string; // ISO string format for date
  updatedAt: string; // ISO string format for date
  __v: number;
  postalCode?: string; // Optional, as not all records have postalCode
}

interface ratings {
  rate: number;
  count: number;
}

interface Product {
  _id: number | string;
  name: string;
  description: string;
  perUnitCost: string | number;
  colour?: string;
  sku: string;
  stock: number | string;
  thresholdStock: number | string;
  measurementType: string;
  size?: string;
  gender?: string;
}

interface updateProduct {
  _id: number | string;
  name: string;
  description: string;
  perUnitCost: string | number;
  colour?: string;
  sku: string;
  stock: number | string;
  thresholdStock: number | string;
  measurementType: string;
  size?: string;
  gender?: string;
}

// tomorrow arrival product
type ProductTomorrow = {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  images: string[];
  isDeleted: boolean;
  gender: string;
  category: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Customer = {
  _id: string;
  customerName: string;
  phoneNumberPrimary: string;
  phoneNumberSecondary: string;
};

type TomorrowArrivalProduct = {
  depositeAmount: number;
  amount: number;
  _id: string;
  products: ProductTomorrow[];
  customer: Customer;
  notes: string;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  advancePayment: number;
  rentalType: string;
  organizationId: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// select component
type SelectOptions = {
  label: string;
  value: number | string;
};

//conflict
type conflictProps = {
  productId: string;
  available: number;
  required: number;
};

type laundryConflictProps = {
  productId: string;
  name: string;
  sku: string;
};

interface ProductDetails {
  productId: string;
  deliveryDate: string | Date;
  returnDate: string | Date;
  price: number | string;
}
[];

interface ProductBooking {
  id?: string;
  _id?: string;
  products: {
    productId: string;
    perUnitCost: number | string;
    unit: number | string;
  }[];
  customer?: {
    _id: string;
    customerName: string;
    phoneNumberPrimary: string;
    phoneNumberSecondary: string;
  };
  notes: string;
  isDeleted?: boolean;
  gstRate?: number | string;
  amount: number | string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  discountAmount?: string | number;
  discountType?: string;
  businessGstNumber: string;

  __v?: number;
}

interface CalendarProduct {
  id?: string;
  _id?: string;
  products: {
    _id?: string | number;

    productId: string;
    perUnitCost: number | string;
    unit: number | string;
  }[];
  customer?: {
    _id: string;
    customerName: string;
    phoneNumberPrimary: string;
    phoneNumberSecondary: string;
  };
  notes: string;
  isDeleted?: boolean;
  gstRate?: number | string;
  amount: number | string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface OrganizationInfo {
  id?: string;
  organizationName: string;
  ownerName: string;
  description: string;
  email: string;
  contactNumber: string;
  address: string;
  billingRules: string[];
  logo: File | null;
  gstNumber: string;
}

interface CSVProps {
  measurementType: string;
  csvFile: File;
}
