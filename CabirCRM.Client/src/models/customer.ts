export type Customer = {
  id: string; // GUID formatı
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  registrationDate: string; // ISO 8601 formatlı tarih (örneğin: "2024-04-28T12:34:56Z")
}

export type CustomerUpdateRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  region?: string;
}