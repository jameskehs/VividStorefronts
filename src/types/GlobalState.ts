import { StorefrontPage } from '../enums/StorefrontPage.enum';

export interface GlobalState {
  currentPage: StorefrontPage | null;
  baseURL: string;
}
