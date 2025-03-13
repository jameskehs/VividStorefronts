import { StorefrontPage } from "../enums/StorefrontPage.enum";

export interface GlobalState {
  myAccountData: any;
  currentPage: StorefrontPage | null;
  baseURL: string;
}
