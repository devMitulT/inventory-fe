export interface Products {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sku: string;
}

export interface CalendarDataType {
  start: string;
  end: string;
  id: string;
  text: string;
  productId: string;
  _id?: string;
}
