import { InvoiceStatus, InvoiceTab } from "@/enums/invoice";

export interface Invoice {
  id: string;
  client: string;
  logo: string;
  color: string;
  amount: number;
  issued: string;
  due: string;
  status: InvoiceStatus;
  desc: string;
}

export interface InvoiceModalState {
  invoice?: Invoice;
}

export interface InvoiceFormState {
  client: string;
  logo: string;
  desc: string;
  amount: number;
  due: string;
  status: InvoiceStatus;
}

export interface InvoiceFiltersState {
  tab: InvoiceTab;
  search: string;
}
